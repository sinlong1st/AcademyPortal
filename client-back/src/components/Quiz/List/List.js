import React from 'react'
import PropTypes from 'prop-types'
import isEmptyObj from '../../../validation/is-empty';
import {Card, Table, CardBody,  CardHeader, CardFooter} from 'reactstrap';
import ReactLoading from 'react-loading';

const jumpToDetail = testQuizid => {
  this.props.history.push('/test/quiz/detail/' + testQuizid)
}

const ListTestQuiz = ({ listTestQuiz }) => {
  let list = '';
  if(listTestQuiz === null)
    {
      list = <tr><td></td><td></td><td ><ReactLoading type='bars' color='#05386B' height={100} width={50} /></td><td></td></tr>
    } else if(isEmptyObj(listTestQuiz)) {
        list = <tr><td></td><td></td><td >Bạn hiện không có bài kiểm tra nào</td><td></td></tr>
      } else {
        list = listTestQuiz.map(testQuiz=>
          <tr key={testQuiz._id} onClick={jumpToDetail.bind(this, testQuiz._id)} className="changeCursor">
            <td className="text-center" >
              {testQuiz.title}
            </td>
            {/* <td>
              {testQuiz.title}
            </td> */}
            {/* <td>
              <div>{course.mainteacher}</div>
            </td>
            <td>
              <Moment format="DD/MM/YYYY">
                {course.created}
              </Moment>
            </td> */}
          </tr>
        )
      }
  return list;
}

ListTestQuiz.propTypes = {

}


export default ListTestQuiz;