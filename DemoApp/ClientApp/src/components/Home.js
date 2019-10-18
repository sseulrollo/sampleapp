import React from 'react'
import {Container, Icon, Header, List } from 'semantic-ui-react'

const Home = () => (
  <Container style={{ marginTop: '2em' }}>
    <Header as='h2' icon textAlign='center'>
      <Icon name='edit' circular />
      <Header.Content>
        Prototype 입니다.
      </Header.Content>
    </Header>
    <Container style={{marginTop:'3em'}}>
      <h3>테스트 가능한 기능은 아래와 같습니다.</h3>
      <List style={{marginTop: '1em'}}>
        <List.Item style={{marginTop: '1em'}}>
          <Icon name='lock' size='big' />
          <List.Content>
            <List.Header>로그인</List.Header>
            <List.Description>Log in/Log out 기능</List.Description>
          </List.Content>
        </List.Item>
        <List.Item style={{marginTop: '1em'}}>
          <Icon name='linkify' size='big' />
          <List.Content>
            <List.Header>메뉴</List.Header>
            <List.Description>Routing 기능</List.Description>
          </List.Content>
        </List.Item>
        <List.Item style={{marginTop: '1em'}}>
          <Icon name='file outline' size='big' />
          <List.Content>
            <List.Header>Test 페이지</List.Header>
            <List.Description>Dropdown control, Db connection, Table</List.Description>
          </List.Content>
        </List.Item>
      </List>
    </Container>
  </Container>
)

export default Home