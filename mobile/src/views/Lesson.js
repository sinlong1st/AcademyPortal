import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator, Alert, Linking } from 'react-native';
import { connect } from 'react-redux';
import { Divider, Card, ListItem } from 'react-native-elements';
import isEmptyObj from '../validation/is-empty';
import { getLessonIncourse } from '../actions/lessonActions'; 
import moment from "moment";
import HTML from 'react-native-render-html';
import { cacheFonts } from "../helpers/AssetsCaching";
import ExerciseLesson from './ExerciseLesson';
import QuizLesson from './QuizLesson';

class Lesson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      courseId: ''
    };
    this.handleGoToUrl = this.handleGoToUrl.bind(this);
  }

  async componentDidMount () {
    await cacheFonts({
      bold: require('../../assets/fonts/Montserrat-Bold.ttf'),
      bold2: require('../../assets/fonts/Ubuntu-Bold.ttf')
    });

    const { navigation } = this.props;
    const courseId = navigation.getParam('courseId', 'NO-ID');
    const lessonId = navigation.getParam('lessonId', 'NO-ID');

    this.setState({
      courseId
    })
    this.props.getLessonIncourse(courseId, lessonId)
  }

  componentWillReceiveProps(nextProps) {
    
    const { lesson_in_course, loading } = nextProps.lesson
    if(!isEmptyObj(lesson_in_course))
    {
      var { text, content, files, exercises, quizzes } = lesson_in_course

      this.setState({ 
        text,
        content,
        files,
        exercises,
        quizzes,
        loading 
      });
    }
    this.setState({ 
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

  render() {
    const { 
      content, 
      text, 
      loading,
      files,
      exercises,
      quizzes 
    } = this.state;
    return (
      <View style={{flex: 1}}>
      {
        loading
        ?
        <View style={styles.container}> 
          <ActivityIndicator size="large" />
        </View>
        :
        <ScrollView>
          <View style={{margin: 15}}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 20, fontWeight:'bold'}}>
                {text}
              </Text>
            </View>
            <Divider style={{ backgroundColor: 'grey', marginTop: 10 }} />
            <View style={{ alignItems: 'center',  marginTop: 20 }}>
              <Text style={styles.title}>Nội dung bài học</Text>
            </View>
              {
                content
                ?
                <View
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: 'rgba(110, 120, 170, 1)'
                  }}
                >
                  <View style={{marginLeft: 10}}>
                    <HTML html={content} />
                  </View>
                </View>
                :
                <View
                  style={styles.noinfo}
                >
                  <View style={{marginLeft: 10, marginTop: 30 }}>
                    <Text style={{ color: 'grey'}}>Chưa cập nhật nội dung bài học</Text>
                  </View>
                </View>
              }
            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <Text style={styles.title}>Tài liệu học</Text>
            </View>
            <View style={{ marginBottom:20 }}>
              {
                files.length === 0
                ?
                <View
                  style={styles.noinfo}
                >
                 <View style={{marginLeft: 10, marginTop: 30}}>
                  <Text style={{ color: 'grey'}}>Chưa có tài liệu học</Text>
                  </View>
                </View>
                :
                <View>
                {
                  files.map(file=>
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
                </View>
              }
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.title}>Bài tập</Text>
            </View>
            <View style={{ marginBottom: 20 }}>
            {
              exercises.length === 0
              ?
              <View
                style={styles.noinfo}
              >
              <View style={{marginLeft: 10, marginTop: 30}}>
                <Text style={{ color: 'grey'}}>Chưa có bài tập</Text>
                </View>
              </View>
              :
              exercises.map((e, i) => {
                return (
                  <View key={i} style={{marginTop:10}}>
                    <ExerciseLesson exercise={e}/>
                  </View>
                );
              })
            }
            </View>

            <View style={{ alignItems: 'center' }}>
              <Text style={styles.title}>Bài trắc nghiệm</Text>
            </View>
            <View style={{ marginBottom: 20 }}>
            {
              quizzes.length === 0
              ?
              <View
                style={styles.noinfo}
              >
              <View style={{marginLeft: 10, marginTop: 30}}>
                <Text style={{ color: 'grey'}}>Chưa có bài trắc nghiệm</Text>
                </View>
              </View>
              :
              quizzes.map((quiz,index) =>{
                return (
                  <View key={index} style={{marginTop:10}}>
                    <QuizLesson courseId={this.state.courseId} quiz={quiz}/>
                  </View>
                );
              })
            }
            </View>
          </View>

        </ScrollView>
      }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  title: {
    fontFamily: 'bold',
    color: '#4169E1',
    fontSize: 15
  },
  noinfo: {
    alignItems: 'center',
    height:80,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(110, 120, 170, 1)'
  }
});

const mapStateToProps = state => ({
  lesson: state.lesson,
  auth: state.auth
});
export default connect(mapStateToProps, { getLessonIncourse })(Lesson); 