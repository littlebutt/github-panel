/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ChangeEvent, useRef, useState } from 'react'
import {
  NavList,
  Text,
  Heading,
  FormControl,
  TextInput,
  Select,
  Button,
} from '@primer/react'

import './settings-panel.css'

export interface SettingsPanelProps {
  accessToken: string
  setAccessToken: (accessToken: string) => void
  username: string
  setUsername: (username: string) => void
}

const SettingsPanel: React.FC<SettingsPanelProps> = (props) => {
  const itemsDivRef = useRef(null)

  const [showPassword, setShowPassword] = useState<boolean>(false)

  const scrollToTop = () => (itemsDivRef.current.scrollTop = 0)
  const scrollToBottom = () => (itemsDivRef.current.scrollTop = 300)

  const onChangeAccessToken = (event: ChangeEvent<HTMLInputElement>) => {
    props.setAccessToken(event.target.value)
  }

  const onChangeUsername = (event: ChangeEvent<HTMLInputElement>) => {
    props.setUsername(event.target.value)
  }

  const save = () => {
    // @ts-ignore
    window.ConfigAPI.setAccessToken(props.accessToken)
    // @ts-ignore
    window.ConfigAPI.setUsername(props.username)
    // @ts-ignore
    window.ConfigAPI.save()
    // // @ts-ignore
    // window.SystemAPI.restart()
  }

  // @ts-ignore
  const quit = () => window.SystemAPI.quit()

  return (
    <div className="main">
      <div className="menu">
        <NavList className="navlist">
          <NavList.Item className="navitem" onClick={scrollToTop}>
            <Text weight="medium">Base</Text>
          </NavList.Item>
          <NavList.Item className="navitem" onClick={scrollToBottom}>
            <Text weight="medium">Theme</Text>
          </NavList.Item>
          <NavList.Item className="navitem" onClick={scrollToBottom}>
            <Text weight="medium">Plugins</Text>
          </NavList.Item>
        </NavList>
      </div>
      <div className="items" ref={itemsDivRef}>
        <div className="item">
          <Heading variant="medium">Base</Heading>
          <FormControl>
            <FormControl.Label>Access Token</FormControl.Label>
            <TextInput
              type={showPassword ? 'text' : 'password'}
              onChange={onChangeAccessToken}
              value={props.accessToken}
              onFocus={() => setShowPassword(true)}
              onBlur={() => setShowPassword(false)}
            ></TextInput>
          </FormControl>
          <FormControl>
            <FormControl.Label>Username</FormControl.Label>
            <TextInput
              onChange={onChangeUsername}
              value={props.username}
            ></TextInput>
            {/* <FormControl.Validation variant='success'></FormControl.Validation> */}
          </FormControl>
        </div>
        <div className="item">
          <Heading variant="medium">Themes</Heading>
          <FormControl disabled>
            <FormControl.Label>Current Theme</FormControl.Label>
            <Select style={{ width: '90px' }}>
              <Select.Option value="default">Default</Select.Option>
            </Select>
          </FormControl>
        </div>
        <div className="item">
          <Heading variant="medium">Plugins</Heading>
          <FormControl disabled>
            <FormControl.Label>Current Plugins</FormControl.Label>
            <Select style={{ width: '90px' }}>
              <Select.Option value="default">Default</Select.Option>
            </Select>
          </FormControl>
        </div>
        <div className="item buttons">
          <div>
            <Button variant="default" size="small" onClick={save}>
              Save
            </Button>
          </div>
          <div>
            <Button variant="danger" size="small" onClick={quit}>
              Quit
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPanel
