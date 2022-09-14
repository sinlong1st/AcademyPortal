import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Field, FieldArray, reduxForm } from 'redux-form';
import { Col, Button, Form, FormGroup, Label, InputGroup, Input, Alert } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { addMoreQuiz } from '../../actions/quizbankActions';

class AddMoreQuizForm extends Component {
  submit = (values) => {
    return this.props.addMoreQuiz(this.props.match.params.id, values);
  }
  
  renderInputFieldInline = ({ input, label, type, id='', meta: { touched, error } }) => {
  return (
    <FormGroup row>
      <Label for={id} sm={2}>{label}: </Label>
      <Col sm={10}>
      <InputGroup className="input-prepend">
        <Input {...input} type={type} placeholder={label} id={id}/>
      </InputGroup>
        {touched && error && <Alert color="danger">{error}</Alert>}
      </Col>
    </FormGroup>
    )
  }  
  renderInputFieldHaveRemove = ({ input, label, type, id='', meta: { touched, error }}) => (
    <Col sm={8}>
      <InputGroup className="input-prepend">
        <Input {...input} type={type} placeholder={label} id={id}/>
      </InputGroup>
      {touched && error && <Alert color="danger">{error}</Alert>}
    </Col>
  );

  renderSelectField = ({ input, label, id, meta: { touched, error }, children }) => (
    <FormGroup row>
      <Label for={id} sm={2}>{label}: </Label>
      <Col sm={10}>
      <InputGroup className="input-prepend">
        <Input {...input} type="select" placeholder={label} id={id}>
          {children}
        </Input>
      </InputGroup>
      {touched && error && <Alert color="danger">{error}</Alert>}
      </Col>
    </FormGroup>
  );
  
   renderTextAnswers = ({ fields, question, meta: { error } }) => (
    <div>
      {
        fields.map((answer, index) =>
          <FormGroup row key={index}>
            <Label for="" sm={2}>{`Câu trả lời ${index + 1}`}: </Label>
            <Field
              name={answer}
              type="textarea"
              component={this.renderInputFieldHaveRemove}
              label={`Câu trả lời ${index + 1}`}
            />
            <Col sm={2}>
              <Button type="button" onClick={() => fields.remove(index)}>Xóa câu trả lời</Button>
            </Col>
          </FormGroup>
        )
      }
      <Button type="button" onClick={() => fields.push()}>Thêm câu trả lời</Button>
      <FormGroup>
        <Field
          name={`${question}.correctAnswer`}
          component={this.renderSelectField}
          label="Câu trả lời đúng"
        >
          <option value=''>Chọn câu trả lời đúng</option>
          {
            fields.map((answer, index) => 
              <option key={index+1} value={index+1}>{`Câu trả lời ${index + 1}`}</option>
            )
          }
        </Field>
      </FormGroup>
      {error && <Alert color="danger">{error}</Alert>}
    </div>
  );
  
  renderQuizzes = ({ fields, meta: { touched, error, submitFailed } }) => (
    <FormGroup>
      {
        fields.map((quiz, index) => 
          <div key={index}>
            <h4>Câu hỏi {index + 1}: </h4>
            <Field
              name={`${quiz}.question`}
              type="textarea"
              component={this.renderInputFieldInline}
              label="Câu hỏi"
            />
            <FieldArray name={`${quiz}.answers`} component={this.renderTextAnswers} question={quiz} />
            <Field
              name={`${quiz}.explanation`}
              type="textarea"
              component={this.renderInputFieldInline}
              label="Giải thích"
            />
            <FormGroup>
              <Button color="danger" onClick={() => fields.remove(index)}>Xóa Câu hỏi</Button>
            </FormGroup>
          </div>
        )
      }
      <Button color="success" type="button" onClick={() => fields.push({
        "answers" : [ null, null, null, null ]
      })}>Thêm câu hỏi</Button>
      {(touched || submitFailed) && error && <Alert color="danger">{error}</Alert>}
    </FormGroup>
  );

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <Form name="text-form" onSubmit={ handleSubmit(this.submit) } >
	      <FieldArray name="listQuiz" component={this.renderQuizzes} />
	      <FormGroup>
	        <Button color="primary" type="submit" disabled={pristine || submitting}>Lưu</Button>{' '}
	        <Button color="secondary" type="button" disabled={pristine || submitting} onClick={reset}>
	          Xóa tất cả
	        </Button>
	      </FormGroup>
	    </Form>
    );
  }
}

AddMoreQuizForm = reduxForm({ form: 'AddMoreQuizForm' })(AddMoreQuizForm);

AddMoreQuizForm = connect( state => { return {} }, { addMoreQuiz } )(AddMoreQuizForm)

export default withRouter(AddMoreQuizForm);