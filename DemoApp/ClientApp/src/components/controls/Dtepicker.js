import React from "react";
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css";
 
// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';
 
class Dtepicker extends React.Component {
  

  constructor(props)  {
    super(props)
    this.state = {
      startDate: new Date('1900-01-01')
    };
  }

  componentDidMount () {
    if(this.state.startDate.toLocaleDateString() === new Date('1900-01-01').toLocaleDateString())
      this.setState({
        startDate : this.props.value
      })
      this.handleChange(this.props.value)
  }
 
  handleChange = date => {
    this.setState({
      startDate: date
    });

    let seprateDate = new Date(date).toLocaleDateString().split('.');

    var year = seprateDate[0].trim();
    var month = seprateDate[1].trim().length === 1 ? '-0' + seprateDate[1].trim() : '-' + seprateDate[1].trim()
    var day = seprateDate[2].trim().length === 1 ? '-0' + seprateDate[1].trim() : '-' + seprateDate[2].trim()

    var outDate = year+month+day;

    this.props.onChange(this.props.id, date, outDate)
  };

  render() {
    return (
      <DatePicker
        key={'date' + this.props.id}
        selected={this.state.startDate}
        onChange={this.handleChange}
        locale="ko"
        show
        dateFormat="yyyy-MM-dd"
      />
    );
  }
}

export default Dtepicker