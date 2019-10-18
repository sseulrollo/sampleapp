import React, {Component} from 'react'
import update from 'immutability-helper';
import PropTypes from 'prop-types'

import { toast } from 'react-toastify'

import { connect } from 'react-redux';
import { Table, Segment, Responsive, Checkbox } from 'semantic-ui-react';

import { bindActionCreators } from 'redux';
import { actionCreators } from '../../store/Spcall';
import Loader from './Loader'

class SelectRowTable extends Component {

    _isMounted = false;

    state = {
        sp_name: '',
        selectParams: [],
        addParams:[],
        header: [],
        data: [],
        selections: {}
    };

    constructor(props) {
        super(props)

        this.state = {
            data: props.initialData,
            initialData: props.initialData,
            header: props.initialHeader,
            selectedList: [],
            selectParams: props.selectParams,
            loadSp : props.loadSp,
            delFlag: props.delFlag,
            searchFlag: props.searchFlag,
            selections: {},
            checkSame: props.checkSame === undefined ? true : props.checkSame,
            checkValue : props.checkValue,
        }
        
    }

    notifyWarn = msg => this.toastId = toast.warn(msg, { autoClose: true})
    notifySuccess = msg => this.toastId = toast.success(msg, { autoClose: true})

    componentDidMount = () => {
        this._isMounted = true;
    }

    getAddData = (tableParam) => {
        const {loadSp, checkSame, checkValue, initialData, data} = this.state;
        
        if(checkSame && checkValue !== "" && data.length > 0){
            
            if(checkSame && (data.filter(r=> r["@@key"] === tableParam[checkValue]).length > 0
                || data.filter(r=> r["@@KEY"] === tableParam[checkValue]).length > 0)){
                this.notifyWarn({msg:'이미 스캔한 데이터입니다.'});
                return;
            }
        }        

        return this.props.loadSingleRequest(loadSp, tableParam)
                .then(() => {
                    if(this.props.spCall.status === "SUCCESS"){
                        this.setState({
                            header: this.props.spCall.header,
                            data:  this.state.data === initialData ? 
                                this.props.spCall.data : 
                                this.state.data.concat(this.props.spCall.data)
                        })
                    }else 
                        {this.notifyWarn(this.props.spCall.message)}
                    
                })
                .catch(e => {this.notifyWarn(e)}
                )
    }


    async getData(params) {
        const {loadSp} = this.state;
       
        return this.props.loadSingleRequest(loadSp, params)
        .then(() => {
            if(this.props.spCall.status === "SUCCESS" && this._isMounted){
                this.setState({
                    header: this.props.spCall.header,
                    data:  this.props.spCall.data
                });
            }
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    removeData(flag) {

        
        if(!this._isMounted)
            return;

        const { selectedList, data } = this.state

        if(selectedList === undefined || selectedList.length === 0)
            return
                    
        if (flag === 'save'){

            let temp = '';
            selectedList.forEach(element => {                
                temp = temp + "," + element
            });

            
            this.props.onSave(temp.substr(1));
        }


        let lst = data;
        // 소문자 @@key check 도 필요
        selectedList.map(item =>
            lst = lst.filter(row => row["@@KEY"] !== item)
        )

        this.setState({
            data: lst,
            selections: {},
            selectedList: []
        })


        this.props.editEndEvent();
        
    }

    handleChkChange = (e) => {
        e.preventDefault();
        this.props.selectedChange(e)
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.tableParam !== this.props.tableParam 
            || nextState.data !== this.state.data
            || nextState.selections !== this.state.selections
            
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextState) {
        
        if(nextProps.selectParams !== [] && nextProps.searchFlag){  
            this.getData(nextProps.selectParams);
        } else if(nextProps.tableParam !== this.props.tableParam 
            && nextProps.tableParam !== []){            
            this.getAddData(nextProps.tableParam)
        } else if(nextProps.selectedList !== this.props.selectedList 
            && nextProps.delFlag !== 'none')
            this.removeData(nextProps.delFlag)        
    }

    isItemSelected = id => this.state.selections[id.keys] === undefined ? 
            false : (this.state.selections[id.keys]);
 
    
    handleSelect = (id) => {
       if (id.keys === 0)
        {
            return;
        }
       
        if(this._isMounted){

            // check 값 제대로 가져오지 못함 수정이 필요하다.
            this.setState((prevState) => {
                if (prevState.selections[id.keys]) {
                // { 1: true } -> {}
                    return update(prevState, {
                        selections:  { $unset: [id.keys] },
                    });
                }
                // {} -> { 1: true }
                return update(prevState, {
                selections: { [id.keys]: { $set: true } },
                });
            });

            const { selectedList } = this.state;

            if(selectedList.filter(r => r === id.keys).length > 0) {
                this.setState({
                    selectedList: selectedList.filter(i => i !== id.keys)
                })
            }
            else  {
                this.setState({
                    selectedList: selectedList.concat(id.keys)
                })
            }
        }
    }
            

    render() {
        const {header, data} = this.state;

        if (data !== undefined && header !== undefined
            && data.length > 0 && header.length > 0){

            const newLocal = <Table.Body>
                {data.map((row, index) => {
                    let cellData = [];
                    const keys = row["@@key"] === "" || row["@@key"] === undefined ? 
                                    row["@@KEY"] === "" || row["@@KEY"] === undefined ? 
                                        index : row["@@KEY"] 
                                : row["@@key"]; 
                    let idx = 0;
                    
                    header.map(head => {
                        const headerTag = head.split(">").length > 1 ? head.split(">")[0] : "";
                        if (head.toLowerCase() === "@@chk")
                            cellData.push(<Table.Cell key={'tc' + index + 'head' + idx}>
                                <Checkbox 
                                    checked={this.isItemSelected({keys})} 
                                    onChange={() => this.handleSelect({keys})} 
                                    key= {'chk' + index + 'head' + idx}
                                />
                            </Table.Cell>);
                        else if (head.startsWith("@@")) { }
                        else if (headerTag === "")
                            cellData.push(<Table.Cell key={'tc' + index + 'head' + idx}>{row[head]}</Table.Cell>);
                        else {
                            const tags = headerTag.replace('<', '').toUpperCase();
                            
                            switch (tags) {
                                case "CHK":
                                    cellData.push(<Table.Cell key={'tc' + index + 'head' + idx}>
                                        <Checkbox 
                                            checked={this.isItemSelected({keys})} 
                                            onChange={() => this.handleSelect({keys})}
                                            key= {'chk' + index + 'head'}
                                        />
                                    </Table.Cell>);
                                    break;
                                default  :
                                    break;
                            }
                        }
                        idx= idx+1;
                    });
                    
                    return <Table.Row key={'th'+ index + keys}>{cellData}</Table.Row>;
                })}
            </Table.Body>;
            
            return (
                <Segment.Group border='none' style={{ boxshadow:'none'}} >
                    <Responsive as={Segment} border='none'
                         maxWidth={Responsive.onlyMobile.maxWidth} 
                         style={{border:'none', padding:'0em', margin:'0em', boxshadow:'none'}}>
                        <Table celled selectable compact definition fixed sortable>
                            {newLocal}
                        </Table>
                    </Responsive>
                    <Responsive
                     as={Segment} border='none'
                     style={{border:'none', padding:'0em', margin:'0em', boxshadow:'none'}}
                     minWidth={Responsive.onlyMobile.maxWidth + 1} >
                        <Table celled selectable compact>
                            <Table.Header>
                                <Table.Row>
                                    {HeaderRow(header)}
                                </Table.Row>
                            </Table.Header>
                            {newLocal}
                        </Table>
                    </Responsive>
                </Segment.Group>
            )}
        else if (header !== undefined && header.length > 0)
            return (
                <Segment.Group border='none' style={{border:'none', boxshadow:'none',padding:'0.5em'}} >
                    <Responsive as={Segment} maxWidth={Responsive.onlyMobile.maxWidth} 
                         style={{boxshadow:'none', border:'none'}}>
                        <Table celled selectable compact definition fixed sortable>
                        </Table>
                    </Responsive>
                    <Responsive 
                        as={Segment} minWidth={Responsive.onlyMobile.maxWidth + 1} 
                        style={{border:'none', padding:'0em', margin:'0em', boxshadow:'none'}} 
                        border='none' boxshadow='none'>
                        <Table celled selectable compact>
                            <Table.Header fixed>
                                <Table.Row>
                                    {HeaderRow(header)}
                                </Table.Row>
                            </Table.Header>
                        </Table>
                    </Responsive>
                </Segment.Group>
            )
        else
            return <Loader />
    }
}

function HeaderRow(header) {
    return (header.map(item => {
            if (item.startsWith("<"))
                return <Table.HeaderCell key={item} scope="col">{item.split('>')[1]}</Table.HeaderCell>
            else if (item.toUpperCase() === "@@CHK")
                return <Table.HeaderCell key={item} scope="col"><Checkbox key='talTotal' ></Checkbox></Table.HeaderCell>
        
            else if (!item.startsWith("@@"))
                return <Table.HeaderCell key={item} scope="col">{item.replace("_", ' ')}</Table.HeaderCell>
            }
        ))
}


SelectRowTable.propTypes = {
    loadSingleRequest: PropTypes.func.isRequired,
    executeRequest: PropTypes.func.isRequired,
    spCall: PropTypes.object
  }

export default connect(
    state => state.spCall,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(SelectRowTable)