import React, { Component } from 'react';
import {  StyleSheet, View, Text, ScrollView, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { ListItem, Input, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { getExercisePoint, addPoint, clearSuccess } from '../actions/exerciseActions';
import isEmptyObj from '../validation/is-empty';
import { NavigationEvents } from 'react-navigation';

const SCREEN_HEIGHT = Dimensions.get('window').height;

class ScoreExercise extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      studentSubmission :[],
      exerciseId: null,
      isLoading: false
    };
  }

  componentDidMount = () => {
    const { navigation } = this.props;
    const exerciseId = navigation.getParam('exerciseId', 'NO-ID');
    this.setState({ exerciseId });
    this.props.getExercisePoint(exerciseId);
  }

  componentWillReceiveProps(nextProps) {
    const { loading } = nextProps.exercises
    this.setState({
      loading
    })

    if (!isEmptyObj(nextProps.exercises.studentSubmission)) {
      const { studentSubmission } = nextProps.exercises.studentSubmission
      this.setState({
        studentSubmission
      })
    }

    if (nextProps.success.mes === "Nhập điểm thành công") {
      Alert.alert('Thành công','Lưu thành công');
      this.setState({
        isLoading: false
      })
      this.props.getExercisePoint(this.state.exerciseId);
      this.props.clearSuccess();
    }
  }

  onChangePoint=(score, subId)=>{
    if(Number(score) <= 10 && Number(score) >= 0)
    {
      this.state.studentSubmission.map(elem => {
        if(elem._id.toString() === subId.toString())
          return elem.point = score;
        return elem;
      })
      this.setState({
        studentSubmission: this.state.studentSubmission
      })
    }
  }

  handleSave=()=>{
    var newPoint = {
      exerciseId: this.state.exerciseId,
      studentSubmission: this.state.studentSubmission
    };
    this.props.addPoint(newPoint);
    this.setState({isLoading: true});
  }

  render() {
    const { loading, studentSubmission, isLoading } = this.state
    return (
      <View style={{ flex: 1, backgroundColor: 'rgba(241,240,241,1)' }}>
        {
          loading
          ?
          <View> 
            <ActivityIndicator size="large" />
          </View>
          :
          <View>
            <Button
              title="Lưu bảng điểm"
              titleStyle={{ fontWeight: 'bold'}}
              onPress={this.handleSave}
              loading={isLoading}
              loadingProps={{ size: 'small', color: 'white' }}
              buttonStyle={{
                height: 40,
                width: 200,
                backgroundColor: '#F08080',
                margin: 10
              }}
            />
            <ScrollView style={{height: SCREEN_HEIGHT - 150}}>
              <View style={{ marginHorizontal: 10}}>
              {
                studentSubmission.map(e =>
                  <ListItem
                    key={e._id}
                    leftAvatar={{ rounded: true, source: { uri: e.userId.photo } }}
                    title={e.userId.name}
                    titleStyle={{ fontWeight: 'bold'}}
                    subtitle={
                      <View>
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={{ marginTop: 5 }}>Điểm: </Text>
                          {
                            e.point
                            ?
                            <Input 
                              inputStyle={{marginLeft: 40}}
                              inputContainerStyle={styles.inputContainer} 
                              value={e.point.toString()} 
                              keyboardType="numeric" 
                              onChangeText={score => this.onChangePoint(score, e._id)}
                            />
                            :
                            <Input 
                              inputStyle={{marginLeft: 40}}
                              inputContainerStyle={styles.inputContainer} 
                              keyboardType="numeric" 
                              onChangeText={score => this.onChangePoint(score, e._id)}
                            />
                          }
                        </View>

                      </View>
                    }
                    containerStyle={{
                      borderWidth: 1,
                      borderColor: 'grey',
                      borderRadius: 8,
                      marginTop: 10
                    }}
                  />
                )
              }
              </View>
            </ScrollView>
          </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(110, 120, 170, 1)',
    height: 30,
    width: 100
  }
});

const mapStateToProps = state => ({
  exercises: state.exercises,
  success: state.success
});

export default connect(mapStateToProps, { getExercisePoint, addPoint, clearSuccess })(ScoreExercise); 