import React, { Component, createRef } from 'react'
import { SearchCombo, SelectRowTable, Dtepicker, BasicButton, CloseButton} from './controls'
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import { actionCreators } from '../store/Spcall';
import { Form, Button } from 'semantic-ui-react'

import update from 'immutability-helper';

import { toast } from 'react-toastify';

const initialHeader = [
    "품번",
    "품명",
    "LOT 번호",
    "수량",
    "@@KEY"
]


const initialData = [
    {
        "품번": "",
        "품명": "",
        "LOT 번호": "",
        "수량": "",
        "@@KEY": ""
    }
]

class InvSearch extends Component {

    state = {
        header: initialHeader,
        data: initialData,
        work_shop: '',
        workdate: new Date(),
        selectParams: {
            work_shop: '',
            workdate: ''
        },
        table_sp: 'SP_PWA_INV_SEARCH',
        searchFlag: false

    }

    constructor(props) {
        super(props)
        this.handelSearch = this.handelSearch.bind(this)
    }

    notifyWarn = msg => toast.warn(msg, { autoClose: true });
    notifySuccess = msg => toast.success(msg, { autoClose: true })


    handleChange = (e) => {
        e.preventDefault();
        if (e.target.value === '')
            return;

        this.setState({
            selectParams: {
                [e.target.name]: e.target.value
            },
            [e.target.name]: ''
        })
    }

    handleCboChange = (id, value) => {        
        this.setState((prevState) => {
            return update(prevState, {
                selectParams: { [id]: { $set : value }},
                [id]: { $set : value }
            })
        })
    }
    
    handleDteChange = (id, value, param) => {
        this.setState((prevState) => {
            return update(prevState, {
                selectParams: { [id]: { $set : param }},
                [id]: { $set : value}})
        })
    }

    handleEventEnd = () => this.setState({ searchFlag: false })

    handelSearch = (e) => {
        e.preventDefault();

        this.setState({
            searchFlag: true
        })
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.searchFlag)
            this.setState({
                searchFlag: false
            })
        return nextProps !== this.props || nextState !== this.state
    }

    getValue = (id) => this.state[id];

    contextRef = createRef()
    render() {

        const { header, data, selectParams, table_sp, searchFlag } = this.state

        return (
            <div border='none'>
                <div ref={this.contextRef} border='none'>
                    <div style={{ backgroundColor: 'white', padding: '1em', border: 'none'}}>
                        <Form>
                            <Form.Field key='toDate'>
                                <label key='lbltoDate' >
                                    작업장
                                    </label>
                                <SearchCombo
                                    id="work_shop"
                                    key="work_shop"
                                    className="form-control"
                                    groupid="LOC_TYPE"
                                    onChange={this.handleCboChange}
                                    value={this.getValue("work_shop")}
                                    searchEnd={this.handleEventEnd} />
                            </Form.Field>
                            <Form.Field key='toWorkshop'>
                                <label key='lbltoWorkshop' >
                                    이동일자
                                    </label>
                                <Dtepicker
                                    id="workdate"
                                    key="workdate"
                                    onChange={this.handleDteChange}
                                    value={this.getValue("workdate")} />
                            </Form.Field>
                        </Form>
                        <SelectRowTable id="tolots"
                            initialHeader={header}
                            initialData={data}
                            loadSp={table_sp}
                            selectParams={selectParams}
                            searchFlag={searchFlag}
                        />
                        <div style={{ height: '3em', border: 'none' }}></div>
                    </div>
                </div>
                <div
                    style={{
                        position: 'fixed', margin: '0em', bottom: '0', left: '0',
                        border: 'none',
                        backgroundColor: 'white', padding: '0.5em', width: '100%'
                    }}>
                    <Button.Group widths='2' basic floated='left'>
                        <BasicButton name="btnOk" onclick={this.handelSearch} label="조회" />
                        <CloseButton history={this.props.history} />
                    </Button.Group> */}
                </div>
            </div>
        )
    }
}


export default connect(
    state => state.spCall,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(InvSearch)