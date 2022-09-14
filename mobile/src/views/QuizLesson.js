import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { Card } from 'react-native-elements';
import moment from "moment";
import { cacheFonts } from "../helpers/AssetsCaching";
import { getMySubmissionQuiz } from '../actions/submissionActions';


class QuizLesson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  async componentDidMount () {
    await cacheFonts({
      bold: require('../../assets/fonts/Montserrat-Bold.ttf'),
      bold2: require('../../assets/fonts/Ubuntu-Bold.ttf')
    });


    this.props.getMySubmissionQuiz(this.props.courseId, this.props.quiz.quizId._id);
  } 

  componentWillReceiveProps(nextProps) {

    const { mysubmissionquiz, loadingquiz } = nextProps.mysubmission
    if(mysubmissionquiz.quizId === this.props.quiz.quizId._id)
      this.setState({ 
        mysubmissionquiz,
        loading: loadingquiz
      });
  }

  render() {
    const { quiz } = this.props;
    const { role } = this.props.auth.user;
    const { mysubmissionquiz, loading } = this.state;
    return (
      <View>
        <Card title={quiz.quizId.title}>
          <View>
            {
              role === 'student'
              ?
              <View>
                <Text>
                  Bắt đầu: <Text style={{color: 'grey'}}>{moment(quiz.startTime).format(" HH:mm [ngày] DD/MM/YYYY")}</Text>
                </Text>
                <Text>
                  Hạn chót làm: <Text style={{color: 'grey'}}>{moment(quiz.deadline).format(" HH:mm [ngày] DD/MM/YYYY")}</Text>
                </Text>
                {
                  loading
                  ?
                  null
                  :
                  <View>
                    {
                      mysubmissionquiz.point
                      ?
                      <View>
                        <Text>
                          Điểm: <Text style={{color: 'grey'}}> {mysubmissionquiz.point}</Text>
                        </Text>
                        <Text style={{color: 'green', fontWeight: 'bold'}}>Đã làm</Text>
                      </View>
                      :
                      <View>
                        <Text>
                          Điểm: <Text style={{color: 'grey'}}> chưa có</Text>
                        </Text>
                        <Text style={{color: 'red', fontWeight: 'bold'}}>Chưa làm</Text>
                      </View>

                    }
                  </View>
                }
              </View>
              :
              <View>
                <Text>
                  Bắt đầu: <Text style={{color: 'grey'}}>{moment(quiz.startTime).format(" HH:mm [ngày] DD/MM/YYYY")}</Text>
                </Text>
                <Text>
                  Hạn chót làm: <Text style={{color: 'grey'}}>{moment(quiz.deadline).format(" HH:mm [ngày] DD/MM/YYYY")}</Text>
                </Text>
              </View>
            }
          </View>
        </Card>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  mysubmission: state.mysubmission
});
export default connect(mapStateToProps, { getMySubmissionQuiz })(QuizLesson); 