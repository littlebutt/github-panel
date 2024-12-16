import { useRef } from 'react'
import { NavList, Text, Heading, FormControl, TextInput, Select, Button } from '@primer/react'

import './settings-panel.css'


const SettingsPanel: React.FC = () => {

    const itemsDivRef = useRef(null)

    const scrollToTop = () => itemsDivRef.current.scrollTop = 0
    const scrollToBottom = () => itemsDivRef.current.scrollTop = 300

    return (
        <div className="main">
            <div className="menu">
                <NavList className='navlist'>
                    <NavList.Item className='navitem' onClick={scrollToTop}>
                        <Text weight='medium'>Base</Text>
                    </NavList.Item>
                    <NavList.Item className='navitem' onClick={scrollToBottom}>
                        <Text weight='medium'>Theme</Text>
                    </NavList.Item>
                    <NavList.Item className='navitem' onClick={scrollToBottom}>
                        <Text weight='medium'>Plugins</Text>
                    </NavList.Item>
                </NavList>
            </div>
            <div className="items" ref={itemsDivRef}>
                <div className='item'>
                    <Heading variant='medium'>Base</Heading>
                    <FormControl>
                        <FormControl.Label>Access Token</FormControl.Label>
                        <TextInput></TextInput>
                    </FormControl>
                    <FormControl>
                        <FormControl.Label>Username</FormControl.Label>
                        <TextInput></TextInput>
                        {/* <FormControl.Validation variant='success'></FormControl.Validation> */}
                    </FormControl>
                </div>
                <div className='item'>
                    <Heading variant='medium'>Themes</Heading>
                    <FormControl disabled>
                        <FormControl.Label>Current Theme</FormControl.Label>
                        <Select style={{width: '90px'}}>
                            <Select.Option value='default'>Default</Select.Option>
                        </Select>
                    </FormControl>
                </div>
                <div className='item'>
                    <Heading variant='medium'>Plugins</Heading>
                    <FormControl disabled>
                        <FormControl.Label>Current Plugins</FormControl.Label>
                        <Select style={{width: '90px'}}>
                            <Select.Option value='default'>Default</Select.Option>
                        </Select>
                    </FormControl>
                </div>
                <div className='item buttons'>
                    <div>
                        <Button variant='default' size='small'>Save</Button>
                    </div>
                    <div>
                        <Button variant='danger' size='small'>Quit</Button>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default SettingsPanel