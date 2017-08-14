import React from "react";
import {Steps, Button, Row, Col, Card, Icon, Input, Radio, Form} from "antd";
import FileReaderInput from "react-file-reader-input";
import {encryptionService} from "../../../Communikey";
import "antd/lib/radio/style/index.less";
import "antd/lib/input/style/index.less";
import "antd/lib/icon/style/css";
import "antd/lib/steps/style/index.less";
import "antd/lib/button/style/index.less";
import "antd/lib/card/style/index.less";
import "antd/lib/upload/style/index.less";
import "antd/lib/message/style/index.less";
import "antd/lib/form/style/index.less";
import "./KeypairWizard.less";

const Step = Steps.Step;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const ManagedForm = Form.create()(
  (props) => {
    const {form, handleSubmit, checkPassword} = props;
    const {getFieldDecorator} = form;
    return (
      <Form hideRequiredMark={true}>
          <Form.Item
            validateStatus={form.getFieldError("password") ? "error"  : ""}
            colon={false}
          >
            {getFieldDecorator("password", {
              rules: [{
                required: true, message: "Password is required"}]
            })(
              <Input
                name="password"
                prefix={<Icon type="lock"/>}
                type="password"
                placeholder="Password"
                onPressEnter={handleSubmit}
              />)
            }
          </Form.Item>
          <Form.Item
            validateStatus={form.getFieldError("passwordConfirmation") ? "error"  : ""}
            colon={false}
          >
            {getFieldDecorator("passwordConfirmation", {
              rules: [{required: true, message: "Password confirmation is required"},
                {validator: checkPassword}]
            })(
              <Input
                name="passwordConfirmation"
                prefix={<Icon type="lock"/>}
                type="password"
                placeholder="Password confirmation"
                onPressEnter={handleSubmit}
              />)
            }
          </Form.Item>
      </Form>
    );
  }
);

class KeypairWizard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      useGenerator: true,
      useUpload: true,
      pasteContent: "",
      selectedMethod: "upload",
      generatorDone: false
    };
  }

  /**
   * Saves the reference to the managed form component.
   *
   * @param form - The form to save the reference to
   * @since 0.15.0
   */
  saveManagedFormRef = (form) => this.form = form;

  /**
   * Handles the action button click event.
   *
   * @since 0.15.0
   */
  handleSubmit = () => this.form.validateFields((errors, payload) => {
    if (!errors) {
      encryptionService.generateKeypair(payload.password);
      this.setState({
        generatorDone: true
      });
    }
  });

  /**
   * Validator for the form to check the equality of both password input fields
   *
   * @since 0.15.0
   */
  checkPassword = (rule, value, callback) => {
    const form = this.form;
    if (value && value !== form.getFieldValue("password")) {
      callback("The passwords don't match. Please try again.");
    } else {
      callback();
    }
  }

  /**
   * Updates the state item of the private key input box
   */
  updateInputValue = (event) => {
    this.setState({
      pasteContent: event.target.value
    });
  };

  /**
   * Switches to the next page.
   */
  next = () => {
    const current = this.state.current + 1;
    this.setState({ current });
  };

  /**
   * Switches to the previous page.
   */
  prev = () => {
    const current = this.state.current - 1;
    this.setState({ current });
  };

  /**
   * Switches to the existing keypair input page.
   */
  selectOwnKeypair = () => {
    this.setState({
      useGenerator: false
    });
    this.next();
  };

  /**
   * Switches to the keypair generator page.
   */
  selectGenerateKeypair = () => {
    this.setState({
      useGenerator: true
    });
    this.next();
  };

  /**
   * Finishes the key generation/upload procedure
   */
  finishProcedure = () => {
    this.next();
  };

  render() {
    const generatorContent = () => {
      return (
          <div className="keypairSetup">
            <Row>
              Please specify a passphrase and then generate a key by pressing the button.
              <ManagedForm
                ref={this.saveManagedFormRef}
                handleSubmit={this.handleSubmit}
                checkPassword={this.checkPassword}
              />
            </Row>
            <Row className="actionRow">
              <Col span={12}>
                <Button class="buttonPrevious" onClick={this.prev}>
                  <Icon type="left"/>
                </Button>
              </Col>
              <Col span={12}>
                <Button class="buttonNext" onClick={this.handleSubmit}>
                  <Icon type="check"/>
                  Finish
                </Button>
              </Col>
            </Row>
          </div>
      );
    };

    /**
     * Handles the uploaded file
     */
    const handleFileResult = (e, results) => {
      results.forEach(result => {
        const [progress] = result;
        console.log("Content:", progress.target.result);
        this.setState(
          {
            useUpload: false,
            pasteContent: progress.target.result,
            selectedMethod: "paste"
          }
        );
      });
    };

    /**
     * Uploader component
     */
    const uploadContent = () => {
      return (
        <div className="keypairSetup">
          <Row>
            {
              this.state.useUpload
                ? <div className="uploader">
                    <FileReaderInput as="binary" id="my-file-input" onChange={handleFileResult}>
                      <Card className="uploadBox">
                        <p className="ant-upload-drag-icon">
                          <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">Click to select your private key file</p>
                        <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
                      </Card>
                    </FileReaderInput>
                  </div>
                : <div className="paster">
                    <Input
                      value={this.state.pasteContent}
                      onChange={this.updateInputValue}
                      placeholder="Please paste your private key in PEM format."
                      type="textarea"
                      defaultValue={this.state.pasteContent}
                      autosize={{minRows: 10, maxRows: 20}}
                    />
                  </div>
            }
          </Row>
          <Row class="actionRow">
            <Col span={8}>
              <Button class="buttonPrevious" onClick={this.prev}>
                <Icon type="left"/>
              </Button>
            </Col>
            <Col span={8}>
              <RadioGroup value={this.state.selectedMethod} size="large">
                <RadioButton value="upload" onClick={() => this.setState({useUpload: true, selectedMethod: "upload"})}>Upload</RadioButton>
                <RadioButton value="paste" onClick={() => this.setState({useUpload: false, selectedMethod: "paste"})}>Paste</RadioButton>
              </RadioGroup>
            </Col>
            <Col span={8}>
              { !this.state.useUpload && this.state.pasteContent &&
                <Button class="buttonNext" onClick={this.finishProcedure}>
                  <Icon type="check"/>
                  Finish
                </Button>
              }
            </Col>
          </Row>
        </div>
      );
    };

    const introductionContent = (
      <div className="introductionContent">
        <Row>
          <Card>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
          </Card>
        </Row>
        <Row>
          <Button type="primary" ghost onClick={this.selectOwnKeypair}>
            <Icon type="tool"/>
            I want to use my own key!</Button>
        </Row>
        <Row>
          <Card>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
          </Card>
        </Row>
        <Row>
          <Button type="primary" ghost onClick={this.selectGenerateKeypair}>
            <Icon type="calculator"/>
            Generate one for me, please.</Button>
        </Row>
      </div>
    );

    const keypairContent = (
      <div>
        { this.state.useGenerator
            ? generatorContent()
            : uploadContent()
        }
      </div>
    );

    const finishContent = (
      <div>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
        <Button onClick={this.prev}>Prev</Button>
      </div>
    );

    const steps = [
      {
        title: "Introduction",
        content: introductionContent,
        icon:"rocket"
      },
      {
        title: "Keypair setup",
        content: keypairContent,
        icon:"key"
      },
      {
        title: "Finish",
        content: finishContent,
        icon:"star-o"
      }
    ];

    const { current } = this.state;
    return (
      <div>
        <Steps current={current}>
          {steps.map(item => <Step key={item.title} title={item.title} icon={item.icon}/>)}
        </Steps>
        <div className="steps-content">{steps[this.state.current].content}</div>
      </div>
    );
  }
}

export default KeypairWizard;