import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Field, FieldArray, reduxForm, formValueSelector } from 'redux-form';
import {Button, Form, FormGroup, Label, Col, 
  InputGroup, InputGroupAddon, InputGroupText, Input} from 'reactstrap';

// import validate from './validate';

class PointsColumn extends Component {
  renderInputFieldInline = ({ input, label, type, id='', meta: { touched, error } }) => (
    <FormGroup row>
      <Label for={id} sm={2}>{label}: </Label>
      <Col sm={10}>
      <InputGroup className="input-prepend">
        <InputGroupAddon addonType="prepend">
          <InputGroupText><i className="fa fa-book"></i></InputGroupText>
        </InputGroupAddon>
        <Input {...input} type={type} placeholder={label} id={id}/>
      </InputGroup>
        {touched && error && <span>{error}</span>}
      </Col>
    </FormGroup>
  );
  renderColumns = ({ fields, meta: { touched, error, submitFailed } }) => (
    <FormGroup>
        {(touched || submitFailed) && error && <span>{error}</span>}
      {fields.map((column, index) => (
        <div key={index}>
          <h4>Cột điểm {index + 1}: </h4>
          <Field
            name={`${column} portion`}
            type="number"
            component={this.renderInputFieldInline}
            label="Tỉ lệ phần trăm"
          />
          <FormGroup>
            <Button color="danger" onClick={() => fields.remove(index)}>Xóa Cột điểm</Button>
          </FormGroup>
        </div>
      ))}
      <Button color="success" type="button" onClick={() => fields.push({})}>Thêm cột điểm</Button>
    </FormGroup>
  );
  render() {

  const { handleSubmit} = this.props;
    return (
      <Form name="text-form" onSubmit = {handleSubmit}>
	      <FieldArray name="columns" component={this.renderColumns} />
	    </Form>
    );
  }
}

PointsColumn = reduxForm({
  form: 'pointColumnForm',
  // validate
})(PointsColumn);

const selector = formValueSelector('textForm');

PointsColumn = connect(
  state => {
    const columns = selector(state, 'columns');
    const pointColumns = columns && columns.map(column => column.columns);

    return { pointColumns: pointColumns }
  }
)(PointsColumn)



export default PointsColumn;
