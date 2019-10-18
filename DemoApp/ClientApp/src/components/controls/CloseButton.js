import React from 'react'
import BasicButton from './BasicButton'

const CloseButton = (props) => <BasicButton name="btnClo" onclick={() => props.history.push("/")} label="닫기" />

export default CloseButton