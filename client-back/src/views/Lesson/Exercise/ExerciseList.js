import React, { Component,Fragment } from 'react';
import { 
  ListGroupItem, 
  ListGroup 
} from 'reactstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Exercise from './Exercise';

class ExerciseList extends Component {
  render() {
    const { exercises } = this.props;

    return (
      <Fragment>
        <div id="accordion">
          {
            exercises.length === 0
            ?
            <ListGroup style={{marginTop:10}}>
              <ListGroupItem>Chưa có bài tập</ListGroupItem>
            </ListGroup>
            :
            exercises.map((exercise,index) => 
              <Exercise exercise={exercise} index={index} key={index}></Exercise>
            )
          }
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
});

export default  withRouter(connect(mapStateToProps, {  })(ExerciseList));  