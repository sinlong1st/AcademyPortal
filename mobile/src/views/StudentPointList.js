import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { Divider, Button, Overlay, Icon, Card } from 'react-native-elements';
import { connect } from 'react-redux';
import { getPointColumnsStudent } from '../actions/pointActions';
import isEmptyObj from '../validation/is-empty'; 


const SCREEN_HEIGHT = Dimensions.get('window').height;

class StudentPointList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: false,
      loading: true
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmptyObj(nextProps.point)) {
      const { student_point, loading } = nextProps.point

      this.setState({
        student_point,
        loading
      })
    } 
  }

  onOpenOverlay = e => {
    e.preventDefault();

    this.props.getPointColumnsStudent(this.props.courseId, this.props.studentId);
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

  caculateTotalPoint(pointColumns){
    var totalPoint = 0; 
    for(var i=0; i<pointColumns.length; i++)
    {
      if(!isEmptyObj(pointColumns[i].submit))
        totalPoint = totalPoint + pointColumns[i].submit.studentSubmission[0].point * pointColumns[i].pointRate / 100
    }
    return totalPoint
  }

  render() {
    const { student_point, loading } = this.state
    return (
      <View>
        <Button
          backgroundColor='#03A9F4'
          containerStyle={{marginLeft: 20}}
          title=' Xem điểm số' 
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
                <View>
                {
                  student_point.pointColumns.length === 0
                  ?
                  <Text style={{ fontSize: 20, fontWeight:'bold' }}> 
                    Chưa cập nhật cột điểm
                  </Text>
                  :
                  <View>
                    {
                      student_point.pointColumns.map(element=>
                        <Card key={element._id} title={element.pointName}>
                          <Text style={{ color: 'grey' }} >
                            <Text style={{color: 'black'}}> 
                              Tỉ lệ: {" "} 
                            </Text>
                            {element.pointRate} %
                          </Text>
                          <Text style={{ color: 'grey', marginTop:10 }} >
                            <Text style={{color: 'black'}}> 
                              Tên bài làm: {" "} 
                            </Text>
                            {
                              element.test
                              ?
                              element.test.title
                              :
                              'Chưa cập nhật'
                            }
                          </Text>
                          <Text style={{ fontWeight: "bold",fontSize: 17, marginTop:10 }} >
                            Điểm: {" "} 
                            {
                              element.submit
                              ?
                              element.submit.studentSubmission[0].point
                              :
                              'Chưa cập nhật'
                            }
                          </Text>
                        </Card>
                      )
                    }
                    <Card>
                      <Text style={{ fontWeight: "bold", fontSize: 20 }} >
                        Tổng điểm: {this.caculateTotalPoint(student_point.pointColumns)}
                      </Text>
                    </Card>
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
  point: state.point
});

export default connect(mapStateToProps, { getPointColumnsStudent })(StudentPointList); 