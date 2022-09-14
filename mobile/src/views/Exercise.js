import React, { Component } from 'react';
import { StyleSheet, View, Text, Linking, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Card, ListItem, Divider } from 'react-native-elements';
import { connect } from 'react-redux';
import { getExerciseList } from '../actions/exerciseActions';
import PropTypes from 'prop-types';
import isEmptyObj from '../validation/is-empty'; 
import moment from "moment";
import Comment from './Comment';
import { NavigationEvents } from 'react-navigation';

class Exercise extends Component {
  constructor(props) {
    super(props);

    this.state = {
      exercises: [], 
      loading: true
    };
    this.handleGoToUrl = this.handleGoToUrl.bind(this);
  }

  componentDidMount = () => {
    const { navigation } = this.props;
    const courseId = navigation.getParam('courseId', 'NO-ID');
    this.props.getExerciseList(courseId);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmptyObj(nextProps.exercises)) {
      const {exercises, loading} = nextProps.exercises
      this.setState({
        exercises: exercises,
        loading: loading
      })
    }
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
    const { exercises, loading } = this.state
    return (
      <View style={{ flex: 1 }}>
      {
        loading
        ?
        <View style={styles.container}> 
          <ActivityIndicator size="large" />
        </View>
        :
        <ScrollView>
          <View style={{ marginBottom: 20 }}>
          {
            exercises.length === 0
            ?
            <Text style={{marginTop: 10, textAlign:"center", fontSize:20}}>Chưa có bài tập</Text>
            :
            exercises.map((e, i) => {
              return (
                <View key={i} style={{marginTop:10}}>
                  <Card title={e.title}>
                    <View>
                      <Text style={{color: 'grey'}}>{moment(e.created).format("[- Ngày đăng:] HH:mm [ngày] DD/MM/YYYY")}</Text>
                      <Text style={{color: 'grey'}}>{moment(e.deadline).format("[- Hạn nộp:] HH:mm [ngày] DD/MM/YYYY")}</Text>
                      <Divider style={{ backgroundColor: 'grey', marginTop: 10 }} />
                      <Text style={{marginTop: 10}}>{e.text}</Text>
                      {
                        e.attachFiles.map(file=>
                          <ListItem
                            key={file.id}
                            leftAvatar={{ rounded: false, source: { uri: file.thumbnail ? file.thumbnail: null} }}
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
                      <Divider style={{ backgroundColor: 'grey', marginTop: 10 }} />
                      <Comment exercise={e}/>
                    </View>
                  </Card>
                </View>
              );
            })
          }
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
  }
});

Exercise.propTypes = {
  getExerciseList: PropTypes.func.isRequired,
  exercises: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  exercises: state.exercises
});
export default connect(mapStateToProps, { getExerciseList })(Exercise); 