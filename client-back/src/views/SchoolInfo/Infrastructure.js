import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Card, CardHeader, CardBody, Button, Modal, ModalBody } from 'reactstrap';
import ReactLoading from 'react-loading';
import { getInfrastructure, deleteInfrastructure, clearSuccess } from '../../actions/infrastructureAction';
import SweetAlert from 'react-bootstrap-sweetalert';

class Infrastructure extends Component {
  constructor(props) {
    super(props);
    this.state = {
      infrastructureList: [],
      loading: true,
      isLoading: false,
      isShowSuccess: false
    };
    this.handleClickDelete = this.handleClickDelete.bind(this);
  }

  componentDidMount = () => {
    this.props.getInfrastructure();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.infrastructure) {
      const { infrastructureList, loading } = nextProps.infrastructure
      this.setState({
        infrastructureList,
        loading
      });
    }

    if (nextProps.success.mes === "Xóa cơ sở thành công") {
      this.setState({ isShowSuccess: true, isLoading: false })
      this.props.clearSuccess();
    }

  }

  jumpToAddInfrastructure = () => {
    this.props.history.push(`/infrastructure/add`);
  }

  handleClickDelete(infrastructureId){
    this.setState({isLoading: true})
    this.props.deleteInfrastructure(infrastructureId)
  } 

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
    this.props.getInfrastructure();
  }

  render() {
    const { infrastructureList, loading } = this.state
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <strong>Danh sách cơ sở</strong>
          </CardHeader>
          <CardBody className="p-4">
            <Button color="primary" onClick={this.jumpToAddInfrastructure}>Thêm một cơ sở</Button>
            <div style={{ marginTop: 20 }}>
              {
                loading
                ?
                <ReactLoading type='bars' color='#05386B' />
                :
                infrastructureList.length === 0
                ?
                <h3>Không có khóa học</h3>
                :
                <Table responsive className="table-outline mb-0 d-none d-sm-table">
                  <thead className="thead-light">
                    <tr>
                      <th>Tên cơ sở</th>
                      <th>Địa chỉ</th>
                      <th>Xóa cơ sở</th>
                      <th>Chỉnh sửa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      infrastructureList.map(infrastructure =>
                        <tr key={infrastructure._id}>
                          <td>
                            {infrastructure.name}
                          </td>
                          <td>
                            {infrastructure.address}
                          </td>
                          <td>
                            <Button color="danger" onClick={this.handleClickDelete.bind(this, infrastructure._id)} > Xóa </Button>                          
                          </td>
                          <td>
                            <Button color="success" onClick={()=>this.props.history.push(`/infrastructure/edit/${infrastructure._id}`)}> Sửa </Button>
                          </td>
                        </tr>
                      )
                    }
                  </tbody>
                </Table>
              }
            </div>
          </CardBody>
        </Card>
        <SweetAlert
          	success
          	confirmBtnText="OK"
          	confirmBtnBsStyle="success"
          	title="Xóa thành công"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Loading</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='spinningBubbles' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  success: state.success,
  infrastructure: state.infrastructure
});

export default connect(mapStateToProps, { getInfrastructure, deleteInfrastructure, clearSuccess })(Infrastructure);  