import path from 'path'
import fs from 'node:fs'
import os from 'node:os'

import TOML, { JsonMap } from '@iarna/toml'

const defaultConfig = ``

export interface ConfigBase {
  accessToken?: string
  username?: string
}

export interface ConfigTheme {
  name: string
  activate?: boolean
}

export interface ConfigPlugin {
  name: string
  activate?: boolean
}

export interface ConfigProps {
  configPath?: string | fs.PathLike
}

export class Config {
  private configPath?: string | fs.PathLike

  private configBase?: ConfigBase

  private configThemes?: ConfigTheme[]

  private configPlugins?: ConfigPlugin[]

  constructor(props: ConfigProps) {
    this.configPath = props.configPath ?? this._getConfigPath()
    this._loadConfig(this.configPath)
  }

  _getConfigPath() {
    const homeDir = os.homedir()
    const configDir =
      process.platform === 'win32' ? homeDir : path.join(homeDir, '.config')
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir)
    }
    const config = path.join(configDir, 'gh-panel.toml')
    if (!fs.existsSync(config)) {
      fs.writeFileSync(config, defaultConfig)
    }
    return config
  }

  _loadConfig(path: string | fs.PathLike) {
    const config = TOML.parse(fs.readFileSync(path, 'utf-8'))
    this.configBase = {}
    this.configBase.accessToken = config?.accessToken as string
    this.configBase.username = config?.username as string
    this.configThemes = []
    this.configPlugins = []
    for (const key of Object.keys(config)) {
      if (key.startsWith('theme/')) {
        this.configThemes.push({
          name: key.split('/')[1],
          activate: (config[key] as JsonMap).activate as boolean,
        })
      } else if (key.startsWith('plugin/')) {
        this.configPlugins.push({
          name: key.split('/')[1],
        })
      }
    }
  }

  missBaseConfig() {
    return !this.configBase.username || !this.configBase.accessToken
  }

  save() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, prefer-const
    let data: any = {
      accessToken: this.configBase.accessToken,
      username: this.configBase.username,
    }
    for (const theme of this.configThemes) {
      data[`theme/${theme.name}`] = {
        activate: theme.activate,
      }
    }
    for (const plugin of this.configPlugins) {
      data[`plugin/${plugin.name}`] = {
        activate: plugin.activate,
      }
    }
    fs.writeFileSync(this.configPath, TOML.stringify(data))
  }

  getAccessToken() {
    return this.missBaseConfig() ? null : this.configBase.accessToken
  }

  setAccessToken(accessToken: string) {
    this.configBase.accessToken = accessToken
  }

  getUsername() {
    return this.missBaseConfig() ? null : this.configBase.username
  }

  setUsername(username: string) {
    this.configBase.username = username
  }

  getConfigThemes() {
    return this.configThemes
  }

  activateConfigTheme(name: string) {
    this.configThemes.forEach((theme) => {
      theme.activate = false
      if (theme.name === name) {
        theme.activate = true
      }
    })
  }

  getConfigPlugins() {
    return this.configPlugins
  }

  activateConfigPlugins(names: string[]) {
    this.configPlugins.forEach((plugin) => {
      if (plugin.name in names) {
        plugin.activate = true
      } else {
        plugin.activate = false
      }
    })
  }
}
