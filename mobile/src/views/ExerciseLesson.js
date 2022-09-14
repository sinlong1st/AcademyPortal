import React, { Component } from 'react';
import { View, Text, Alert, Linking } from 'react-native';
import { connect } from 'react-redux';
import { Divider, Card, ListItem, Button } from 'react-native-elements';
import moment from "moment";
import Comment from './Comment';
import { cacheFonts } from "../helpers/AssetsCaching";
import { getMySubmission } from '../actions/submissionActions';


class ExerciseLesson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      text: '',
      content: '',
      files: [],
      exercises: [],
      quizzes: []
    };
    this.handleGoToUrl = this.handleGoToUrl.bind(this);
  }

  async componentDidMount () {
    await cacheFonts({
      bold: require('../../assets/fonts/Montserrat-Bold.ttf'),
      bold2: require('../../assets/fonts/Ubuntu-Bold.ttf')
    });

    this.props.getMySubmission(this.props.exercise._id);
  } 

  componentWillReceiveProps(nextProps) {

    const { mysubmission, loading } = nextProps.mysubmission
    if(mysubmission.exerciseId === this.props.exercise._id)
      this.setState({ 
        mysubmission,
        loading 
      });
  }

  handleGoToUrl(url){
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Lỗi','Không thể mở');
      }
    });
  }

  handlePressScoreExercise(exerciseId){
    this.props.navigation.navigate('ScoreExercise',{ exerciseId: exerciseId })
  } 

  render() {
    const { exercise } = this.props;
    const { role } = this.props.auth.user;
    const { mysubmission, loading } = this.state;

    return (
      <View>
        <Card title={exercise.title}>
          <View>
            {
              role === 'student'
              ?
              <View>
                <Text>
                  Hạn nộp: <Text style={{color: 'grey'}}>{moment(exercise.deadline).format(" HH:mm [ngày] DD/MM/YYYY")}</Text>
                </Text>
                  {
                    loading
                    ?
                    null
                    :
                    <View>
                      {
                        mysubmission.point
                        ?
                        <Text>
                          Điểm: <Text style={{color: 'grey'}}> {mysubmission.point}</Text>
                        </Text>
                        :
                        <Text>
                          Điểm: <Text style={{color: 'grey'}}> chưa có</Text>
                        </Text>
                      }
                      {
                        mysubmission.note
                        ?
                        <Text>
                          Ghi chú: <Text style={{color: 'grey'}}> {mysubmission.note}</Text>
                        </Text>
                        :
                        null
                      }
                    </View>
                  }
                  {
                    loading
                    ?
                    null
                    :
                    <View>
                      {
                        mysubmission.isSubmit
                        ? 
                        <Text style={{color: 'green', fontWeight: 'bold'}}>Đã nộp</Text>
                        :
                        <Text style={{color: 'red', fontWeight: 'bold'}}>Chưa nộp</Text>
                      }
                    </View>
                  }
              </View>
              :
              <Text>
                Hạn nộp: <Text style={{color: 'grey'}}>{moment(exercise.deadline).format(" HH:mm [ngày] DD/MM/YYYY")}</Text>
              </Text>
            }
            <Divider style={{ backgroundColor: 'grey', marginTop: 10 }} />
            <Text style={{marginTop: 10}}>{exercise.text}</Text>
            {
              exercise.attachFiles.map(file=>
                <ListItem
                  key={file.id}
                  leftAvatar={{ rounded: false, source: { uri: file.thumbnail } }}
                  title={file.name}
                  titleStyle={{ color: 'blue', textDecorationLine: 'underline' }}
                  onPress={this.handleGoToUrl.bind(this, file.url)}
                  containerStyle={{
                    borderWidth: 1,
                    borderColor: 'rgba(110, 120, 170, 1)',
                    borderRadius: 8,
                    marginTop: 10
                  }}
                />
              )
            }
            {
              role === 'teacher' || role === 'admin'
              ?
              <View>
                <Divider style={{ backgroundColor: 'grey', marginTop: 10 }} />
                <Button
                  title="Chấm điểm"
                  buttonStyle={{
                    backgroundColor: 'grey',
                    borderWidth: 2,
                    borderColor: 'white',
                    borderRadius: 30,
                  }}
                  containerStyle={{ marginVertical: 10, height: 50 }}
                  titleStyle={{ fontWeight: 'bold' }}
                  onPress={this.handlePressScoreExercise.bind(this, e._id)}
                />
                <Comment exercise={e}/>
              </View>
              :
              null
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
export default connect(mapStateToProps, { getMySubmission })(ExerciseLesson); 