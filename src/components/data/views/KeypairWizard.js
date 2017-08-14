import React from "react";
import {Steps, Button, Row, Card, Icon, Input, Radio} from "antd";
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
import "./KeypairWizard.less";

const Step = Steps.Step;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class KeypairWizard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      useGenerator: true,
      useUpload: true,
      pasteContent: "",
      selectedMethod: "upload"
    };
  }

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

  /**
   * Switches between the upload and paste input boxes.
   */
  generateKeypairWithPassphrase = () => {
    encryptionService.generateKeypair("passphrase");
  };

  render() {
    const generatorContent = () => {
      return (
        <div>
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
          <br/>
          <br/>
          <br/>
          <Button onClick={this.generateKeypairWithPassphrase}>Generate!</Button>
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
        <div className="uploadContent">
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
          <Row>
            <Button onClick={this.prev}>
              <Icon type="left"/>
            </Button>
            <RadioGroup value={this.state.selectedMethod} size="large">
              <RadioButton value="upload" onClick={() => this.setState({useUpload: true, selectedMethod: "upload"})}>Upload</RadioButton>
              <RadioButton value="paste" onClick={() => this.setState({useUpload: false, selectedMethod: "paste"})}>Paste</RadioButton>
            </RadioGroup>
            { !this.state.useUpload && this.state.pasteContent &&
              <Button onClick={this.finishProcedure}>
                <Icon type="check"/>
                Finish
              </Button>
            }
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