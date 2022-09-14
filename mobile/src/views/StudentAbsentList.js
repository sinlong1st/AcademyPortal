import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { Divider, Button, Overlay, Icon, Card } from 'react-native-elements';
import { connect } from 'react-redux';
import { getStudentAbsent } from '../actions/attendanceActions';
import isEmptyObj from '../validation/is-empty'; 
import moment from "moment";


const SCREEN_HEIGHT = Dimensions.get('window').height;

class StudentAbsentList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: false,
      loading: true
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmptyObj(nextProps.attendance)) {
      const { student_absent_list, loading } = nextProps.attendance

      this.setState({
        student_absent_list,
        loading
      })
    } 
  }

  onOpenOverlay = e => {
    e.preventDefault();

    this.props.getStudentAbsent(this.props.courseId, this.props.studentId);
    this.setState({
      isVisible: !this.state.isVisible
    });
  }

  onCloseOverlay = e => {
    e.preventDefault();

    this.setState({
      isVisible: !this.state.isVisible
    });
  }

  render() {
    const { student_absent_list, loading } = this.state
    return (
      <View>
        <Button
          backgroundColor='#03A9F4'
          containerStyle={{marginLeft: 20}}
          title=' Xem ngày vắng' 
          onPress={this.onOpenOverlay}
        />
        <Overlay isVisible={this.state.isVisible} fullScreen={true}>
          <View style={{height: SCREEN_HEIGHT, flex: 1}}>
            <Icon
              name='times'
              type='font-awesome'
              onPress={this.onCloseOverlay}
              containerStyle={{
                alignSelf: 'flex-end'
              }}
            />
            <Divider style={{ backgroundColor: 'grey', marginTop: 10 }} />
            {
              loading
              ?
              <View style={styles.container}> 
                <ActivityIndicator size="large" />
              </View>
              :
              <ScrollView>
                <Text style={{ color: 'grey', marginTop:20 }} >
                  <Text style={{color: 'black'}}> 
                    Số ngày nghỉ / Tổng số ngày điểm danh:{" "} 
                  </Text>
                  {student_absent_list.absentlist.length} / {student_absent_list.attendanceNumber}
                </Text>
                <View style={{ marginTop:20 }}>
                {
                  student_absent_list.absentlist.length === 0
                  ?
                  <Text style={{ fontSize: 20, fontWeight:'bold' }}> 
                    Không có ngày nghỉ
                  </Text>
                  :
                  <View>
                    {
                      student_absent_list.absentlist.map(element=>
                        <Card key={element._id} title={moment(element.date).format("[Ngày nghỉ] DD/MM/YYYY")}>
                          <Text style={{ color: 'grey', marginTop:10 }} >
                            <Text style={{color: 'black'}}> 
                              Giờ học: {" "} 
                            </Text>
                            {
                              element.event
                              ? 
                              <Text>
                                {moment(element.event.start).format("HH:mm -")} {moment(element.event.end).format("HH:mm")} 
                              </Text>
                              :
                              'Chưa cập nhật'
                            }
                          </Text>
                          <Text style={{ color: 'grey', marginTop:10 }} >
                            <Text style={{color: 'black'}}> 
                              Bài học: {" "} 
                            </Text>
                            {
                              element.event
                              ? 
                              <Text>
                                {element.event.lessonId.text}
                              </Text>
                              :
                              'Chưa cập nhật'
                            }
                          </Text>
                        </Card>
                      )
                    }

                  </View>
                }
                </View>
              </ScrollView>
            }
          </View>
        </Overlay>
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


const mapStateToProps = state => ({
  attendance: state.attendance
});

export default connect(mapStateToProps, { getStudentAbsent })(StudentAbsentList); 