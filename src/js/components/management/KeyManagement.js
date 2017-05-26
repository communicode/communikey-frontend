import React from "react";
import {inject, observer} from "mobx-react";
import {Dimmer, Grid, Segment, Button, Header, Divider} from "semantic-ui-react";
import AdminRoute from "../AdminRoute";
import SelectCategoryModal from "./../modals/SelectCategoryModal";
import "../../../css/components/Admin.css";
import KeyList from "./../lists/KeyList";
import AddKeyModal from "./../modals/AddKeyModal";

/**
 * @author mskyschally@communicode.de
 */
@inject("categoryStore") @observer
class UserManagement extends AdminRoute {
  constructor(props) {
    super(props);
    this.state = {
      addKeyModalIsOpen: false,
      categorySelectionModalVisible: false,
      passedKey: null,
      isLoading: false
    };
  }

  toggleAddKeyModal = () => {
    const {addKeyModalIsOpen} = this.state;
    this.setState({addKeyModalIsOpen: !addKeyModalIsOpen})
  };

  toggleCategorySelectionModal = (passedKey) => {
    this.setState({
      categorySelectionModalVisible: !this.state.categorySelectionModalVisible,
      passedKey: passedKey
    });
  };

  addKeyToCategory = (selectedCategory) => {
    this.setState({isLoading: true});
    this.props.categoryStore.addKey(selectedCategory.id, this.state.passedKey.id).then(() => {
      this.setState({isLoading: false})
    })
  };

  render() {
    return (
      <Segment class="adminView">
        <Header as='h1'>
          Key management
          <Button class="headerButton" icon='plus' content='Key' onClick={this.toggleAddKeyModal}/>
        </Header>
        <Divider />
        <Grid stackable>
          <KeyList onAddKeyToCategory={this.toggleCategorySelectionModal}/>
        </Grid>
        {this.state.addKeyModalIsOpen && <AddKeyModal onModalClose={this.toggleAddKeyModal}/>}
        {
          this.state.categorySelectionModalVisible &&
          <SelectCategoryModal
            passedKey={this.state.passedKey}
            onModalClose={this.toggleCategorySelectionModal}
            onAddKeyToCategory={this.addKeyToCategory}/>
        }
      </Segment>
    )
  }
}
export default UserManagement;
