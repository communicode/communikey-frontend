import React from "react";
import { Steps, Button, message } from "antd";
import "antd/lib/message/style/index.less";
import "antd/lib/steps/style/index.less";
import "antd/lib/button/style/index.less";
import "./KeypairWizard.less";
const Step = Steps.Step;
const ButtonGroup = Button.Group;

class KeypairWizard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      useGenerator: true
    };
  }

  next = () => {
    const current = this.state.current + 1;
    this.setState({ current });
  };

  prev = () => {
    const current = this.state.current - 1;
    this.setState({ current });
  };

  selectOwnKeypair = () => {
    this.setState({
      useGenerator: false
    });
    this.next();
  };

  selectGenerateKeypair = () => {
    this.setState({
      useGenerator: true
    });
    this.next();
  };

  render() {
    const generatorContent = () => {
      return (
        <div>
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
          <br/>
          <br/>
          <br/>
        </div>
      );
    };

    const uploadContent = () => {
      return (
        <div>
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
          <br/>
          <br/>
          <br/>
        </div>
      );
    };
    
    const introductionContent = (
      <div>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
        <br/>
        <br/>
        <br/>
        <ButtonGroup>
          <Button onClick={this.selectOwnKeypair}>I want to use my own key!</Button>
          <Button onClick={this.selectGenerateKeypair}>Generate one for me, please.</Button>
        </ButtonGroup>
      </div>
    );

    const keypairContent = (
      <div>
        { this.state.useGenerator
            ? generatorContent()
            : uploadContent()
        }
        <Button onClick={this.prev}>Prev</Button>
        <Button onClick={this.next}>Next</Button>
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
        {/*<div className="steps-action">*/}
          {/*{*/}
            {/*this.state.current < steps.length - 1*/}
            {/*&&*/}
            {/*<Button type="primary" onClick={() => this.next()}>Next</Button>*/}
          {/*}*/}
          {/*{*/}
            {/*this.state.current === steps.length - 1*/}
            {/*&&*/}
            {/*<Button type="primary" onClick={() => message.success("Processing complete!")}>Done</Button>*/}
          {/*}*/}
          {/*{*/}
            {/*this.state.current > 0*/}
            {/*&&*/}
            {/*<Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>*/}
              {/*Previous*/}
            {/*</Button>*/}
          {/*}*/}
        {/*</div>*/}
      </div>
    );
  }
}

export default KeypairWizard;