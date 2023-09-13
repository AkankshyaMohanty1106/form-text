import {
  Button,
  Col,
  Form,
  Input,
  PageHeader,
  Progress,
  Row,
  Select,
  Radio,
  Checkbox,
  notification,
  Space,
  Upload,
  message
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useState, useEffect } from "react";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import "./FormContainer.css";

const FormContaner = () => {
  const { Option } = Select;
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = useForm();
  const [page, setPage] = useState(0);
  const [progressBarPercentage, setProgressBarPercentage] = useState(50);

  const [buttonSet, setButtonSet] = useState("Next");
  const [data, setData] = useState();
  const [Fvalue, setvalue] = useState();
  
  const prev = () => {
    if (page === 0) {
      
    } else {
      setPage(page - 1);
      setButtonSet("Next");
      setProgressBarPercentage(progressBarPercentage - 50);
    }
  };
  const next = () => {
    form.submit();
  };
  const onFinish = (e) => {
    if (page < 1) {
      if (page === 0) {
        setButtonSet("Submit");
        setData(e);
      }

      setPage(page + 1);
      setProgressBarPercentage(progressBarPercentage + 50);
    } else if (page === 1) {
      let newData = data;
      newData["CouponCode"] = e.CouponCode;
      newData["Eazytaxes"] = e.Eazytaxes;
      newData["UploadDocumentForTransaction"] = e.UploadDocumentForTransaction;
      newData["UploadTransactionForms"] = e.UploadTransactionForms;
      newData["transactionIn2022"] = e.transactionIn2022;
      newData["transactionIn2022Capital"] = e.transactionIn2022Capital;
      setData(newData); //write api to stored this json to backend
      console.log("newData", newData);
      messageApi.open({
        type: 'success',
        content: 'Data Saved Successfully !!!',
      });
    }
  };
  const onFinishFailed = () => {};
  
  const CheckBoxValueIS = () => {};
  const normFile = (e) => {
    
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const validateFileUpload = (rule, value) => {
    if (form.getFieldValue("lastYearReturn") === true && !value) {
      return Promise.reject(
        "Please upload a file because you Click upon last year return Yes."
      );
    }
    return Promise.resolve();
  };
  const validateIncorporationDocument = (rule, value) => {
    if (form.getFieldValue("S-CorpIncorporated") === true && !value) {
      return Promise.reject(
        "Please upload a file because you Click upon S-Corp incorporated in 2022 Yes."
      );
    }
    return Promise.resolve();
  };
  const validateLatestShareholdingPattern = (rule, value) => {
    if (form.getFieldValue("ownershipStructure") === true && !value) {
      return Promise.reject(
        "Please upload a file because you Click upon change in ownership structure to Yes."
      );
    }
    return Promise.resolve();
  };

  const validateFilesDocumentForTransaction = (rule, value, callback) => {
    const checkedCheckboxes = form.getFieldValue("transactionIn2022Capital");
    if (value.length === checkedCheckboxes.length) {
      callback();
    } else {
      callback(
        "Please upload files corresponding to the above checked checkboxes."
      );
    }
  };
  const validateFilesDocumentUploadTransactionForms = (
    rule,
    value,
    callback
  ) => {
    const checkedCheckboxes = form.getFieldValue("transactionIn2022");
    if (value.length === checkedCheckboxes.length) {
      callback();
    } else {
      callback(
        "Please upload files corresponding to the above checked checkboxes."
      );
    }
  };

  return (
    <div>
      {contextHolder}
      <div className="marginRightAdg"></div>
      <Progress percent={progressBarPercentage} showInfo={false} />
      <div>
        <div>
          <div className="groupDetailWrap">
            <Form
              name="CustomerAddress"
              autoComplete="off"
              form={form}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              onChange={() => setvalue(form.getFieldValue())}
            >
              {page === 0 ? (
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Row className="groupForm"></Row>
                  </Col>
                  <Col span={24}>
                    <div>
                      <label>Email</label>
                    </div>
                    <Col xl={12} xs={24}>
                      <Form.Item
                        name="email"
                        rules={[
                          {
                            required: true,
                            message: "This field is required",
                          },
                          {
                            type: "email",
                            message: "Email Format is invalid",
                          },
                        ]}
                      >
                        <Input placeholder="Email Address" />
                      </Form.Item>
                      <p style={{ marginTop: "10px" }}>example@example.com</p>
                    </Col>
                    {/* </Row> */}
                  </Col>
                  <Col span={24}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <label style={{ marginBottom: "5px" }}>
                        Did you file the return last year ?
                      </label>
                      <Form.Item
                        name="lastYearReturn"
                        rules={[
                          {
                            required: true,
                            message: "This field is required",
                          },
                        ]}
                      >
                        <Radio.Group>
                          <Space direction="vertical">
                            <Radio value={true}>Yes</Radio>
                            <Radio value={false}>No</Radio>
                          </Space>
                        </Radio.Group>
                      </Form.Item>
                    </div>
                    {/* </Form.Item> */}
                  </Col>
                  <Col span={24}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <label style={{ marginBottom: "5px" }}>File Upload</label>
                      <Form.Item
                        name="FileUpload"
                        // label="File Upload"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e && [e.file]}
                        rules={[
                          {
                            validator: validateFileUpload,
                          },
                        ]}
                      >
                        <Upload.Dragger
                          customRequest={({ onSuccess }) => {
                            setTimeout(() => {
                              onSuccess("ok");
                            }, 0);
                          }}
                          name="files"
                          action="/upload.do"
                          style={{ height: "10px" }}
                        >
                          <p className="ant-upload-drag-icon">
                            <UploadOutlined />
                          </p>
                          <p className="ant-upload-text">
                            Click or drag file to this area to upload
                          </p>
                          <p className="ant-upload-hint">
                            Support for a single or bulk upload.
                          </p>
                        </Upload.Dragger>
                      </Form.Item>
                    </div>
                    {/* </Form.Item> */}
                  </Col>
                  <Col span={24}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <label style={{ marginBottom: "5px" }}>
                        Was the S-Corp incorporated in 2022?
                      </label>
                      <Form.Item
                        name="S-CorpIncorporated"
                        // label="Was the S-Corp incorporated in 2022? "
                        rules={[
                          {
                            required: true,
                            message: "This field is required",
                          },
                        ]}
                      >
                        <Radio.Group>
                          <Space direction="vertical">
                            <Radio value={true}>Yes</Radio>
                            <Radio value={false}>No</Radio>
                          </Space>
                        </Radio.Group>
                      </Form.Item>
                    </div>
                    {/* </Form.Item> */}
                  </Col>
                  <Col span={24}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <label style={{ marginBottom: "5px" }}>
                        Please Upload Incorporation Document
                      </label>
                      <Form.Item
                        name="IncorporationDocument"
                        getValueFromEvent={(e) => e && [e.file]}
                        // label="Please Upload Incorporation Document"
                        valuePropName="fileList"
                        rules={[
                          {
                            validator: validateIncorporationDocument,
                          },
                        ]}
                      >
                        <Upload.Dragger
                          customRequest={({ onSuccess }) => {
                            setTimeout(() => {
                              onSuccess("ok");
                            }, 0);
                          }}
                          name="files"
                          action="/upload.do"
                          style={{ height: "10px" }}
                        >
                          <p className="ant-upload-drag-icon">
                            <UploadOutlined />
                          </p>
                          <p className="ant-upload-text">
                            Click or drag file to this area to upload
                          </p>
                          <p className="ant-upload-hint">
                            Support for a single or bulk upload.
                          </p>
                        </Upload.Dragger>
                      </Form.Item>
                    </div>
                    {/* </Form.Item> */}
                  </Col>
                  <Col span={24}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <label style={{ marginBottom: "5px" }}>
                        Was there any change in ownership structure?
                      </label>
                      <Form.Item
                        name="ownershipStructure"
                        // label="Was there any change in ownership structure? "
                        rules={[
                          {
                            required: true,
                            message: "This field is required",
                          },
                        ]}
                      >
                        <Radio.Group>
                          <Space direction="vertical">
                            <Radio value={true}>Yes</Radio>
                            <Radio value={false}>No</Radio>
                          </Space>
                        </Radio.Group>
                      </Form.Item>
                    </div>
                  </Col>

                  <Col span={24}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <label style={{ marginBottom: "5px" }}>
                        Upload Latest Shareholding pattern
                      </label>
                      <Form.Item
                        name="LatestShareholdingPattern"
                        // label="Upload Latest Shareholding pattern"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e && [e.file]}
                        rules={[
                          {
                            validator: validateLatestShareholdingPattern,
                          },
                        ]}
                      >
                        <Upload.Dragger
                          customRequest={({ onSuccess }) => {
                            setTimeout(() => {
                              onSuccess("ok");
                            }, 0);
                          }}
                          name="files"
                          action="/upload.do"
                          style={{ height: "10px" }}
                        >
                          <p className="ant-upload-drag-icon">
                            <UploadOutlined />
                          </p>
                          <p className="ant-upload-text">
                            Click or drag file to this area to upload
                          </p>
                          <p className="ant-upload-hint">
                            Support for a single or bulk upload.
                          </p>
                        </Upload.Dragger>
                      </Form.Item>
                    </div>
                    {/* </Form.Item> */}
                  </Col>
                </Row>
              ) : (
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <label style={{ marginBottom: "5px" }}>
                        Was there any following transaction in 2022
                      </label>
                      <Form.Item
                        name="transactionIn2022Capital"
                        // label="Was there any following transaction in 2022 "
                        rules={[
                          {
                            required: true,
                            message: "Please select at least one checkbox",
                            type: "array",
                          },
                        ]}
                      >
                        <Checkbox.Group>
                          <Row>
                            <Col span={8}>
                              <Checkbox
                                value={"Capital Infusion"}
                                style={{
                                  lineHeight: "32px",
                                }}
                              >
                                Capital Infusion
                              </Checkbox>
                            </Col>
                            <Col span={24}>
                              <Checkbox
                                value={"Capital Withdrawal"}
                                style={{
                                  lineHeight: "32px",
                                }}
                              >
                                Capital Withdrawal
                              </Checkbox>
                            </Col>
                            <Col span={24}>
                              <Checkbox
                                value={"Related Party Transaction"}
                                style={{
                                  lineHeight: "32px",
                                }}
                              >
                                Related Party Transaction
                              </Checkbox>
                            </Col>
                          </Row>
                        </Checkbox.Group>
                      </Form.Item>
                    </div>
                  </Col>

                  <Col span={24}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <label style={{ marginBottom: "5px" }}>
                        Upload Document for the same :
                      </label>
                      <Form.Item
                        name="UploadDocumentForTransaction"
                        // label="Upload Document for the same : "
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        rules={[
                          {
                            required: true,
                            message:
                              "Please upload files corresponding to the checked checkboxes.",
                            validator: validateFilesDocumentForTransaction,
                          },
                        ]}
                      >
                        <Upload.Dragger
                          name="files"
                          action="/upload.do"
                          style={{ height: "10px" }}
                          multiple={true}
                        >
                          <p className="ant-upload-drag-icon">
                            <UploadOutlined />
                          </p>
                          <p className="ant-upload-text">
                            Click or drag file to this area to upload
                          </p>
                          <p className="ant-upload-hint">
                            Support for a single or bulk upload.
                          </p>
                        </Upload.Dragger>
                      </Form.Item>
                    </div>
                    {/* </Form.Item> */}
                  </Col>
                  <Col span={24}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <label style={{ marginBottom: "5px" }}>
                        Was there any following transaction in 2022
                      </label>
                      <Form.Item
                        name="transactionIn2022"
                        // label="Was there any following transaction in 2022 "
                        rules={[
                          {
                            required: true,
                            message: "Please select at least one checkbox",
                            type: "array",
                          },
                        ]}
                      >
                        <Checkbox.Group>
                          <Row>
                            <Col span={8}>
                              <Checkbox
                                value={"Bank Statement"}
                                style={{
                                  lineHeight: "32px",
                                }}
                              >
                                Bank Statement
                              </Checkbox>
                            </Col>
                            <Col span={24}>
                              <Checkbox
                                value="Credit Card Statements"
                                style={{
                                  lineHeight: "32px",
                                }}
                              >
                                Credit Card Statements
                              </Checkbox>
                            </Col>
                            <Col span={24}>
                              <Checkbox
                                value={"Form 10991"}
                                style={{
                                  lineHeight: "32px",
                                }}
                              >
                                Form 10991
                              </Checkbox>
                            </Col>
                            <Col span={24}>
                              <Checkbox
                                value={"Form 940/941"}
                                style={{
                                  lineHeight: "32px",
                                }}
                              >
                                Form 940/941
                              </Checkbox>
                            </Col>
                            <Col span={24}>
                              <Checkbox
                                value={"EIN Certificate"}
                                style={{
                                  lineHeight: "32px",
                                }}
                              >
                                EIN Certificate
                              </Checkbox>
                            </Col>
                            <Col span={24}>
                              <Checkbox
                                value={"IRC Acceptance Letter of S-Corp"}
                                style={{
                                  lineHeight: "32px",
                                }}
                              >
                                IRC Acceptance Letter of S-Corp
                              </Checkbox>
                            </Col>
                            <Col span={24}>
                              <Checkbox
                                value="Financials (if prepared)"
                                style={{
                                  lineHeight: "32px",
                                }}
                              >
                                Financials (if prepared)
                              </Checkbox>
                            </Col>
                          </Row>
                        </Checkbox.Group>
                      </Form.Item>
                    </div>

                    <Col span={24}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <label style={{ marginBottom: "5px" }}>
                          Please Upload The Following Documents :
                        </label>
                        <Form.Item
                          name="UploadTransactionForms"
                          // label="Upload Document for the same : "
                          valuePropName="fileList"
                          getValueFromEvent={normFile}
                          rules={[
                            {
                              required: true,
                              message:
                                "Please upload files corresponding to the checked checkboxes.",
                              validator:
                                validateFilesDocumentUploadTransactionForms,
                            },
                          ]}
                        >
                          <Upload.Dragger
                            name="files"
                            action="/upload.do"
                            style={{ height: "10px" }}
                            multiple={true}
                          >
                            <p className="ant-upload-drag-icon">
                              <UploadOutlined />
                            </p>
                            <p className="ant-upload-text">
                              Click or drag file to this area to upload
                            </p>
                            <p className="ant-upload-hint">
                              Support for a single or bulk upload.
                            </p>
                          </Upload.Dragger>
                        </Form.Item>
                      </div>
                      {/* </Form.Item> */}
                    </Col>
                  </Col>

                  <p style={{ marginLeft: "12px" }}>
                    Please Complete the payment . we will prepare the draft tax
                    return within 48 hours !
                  </p>

                  <Col span={24} style={{ borderBottom: "1px solid black" }}>
                    <Row>
                      <Col span={8}>
                        <Form.Item
                          name="Eazytaxes"
                          // label="Was there any following transaction in 2022 "
                        >
                          <Checkbox
                            value={true}
                            style={{
                              lineHeight: "32px",
                            }}
                          >
                            Eazytaxes
                          </Checkbox>
                        </Form.Item>
                      </Col>
                      <Col style={{ marginLeft: "150px" }}>
                        <strong>$349.00</strong>
                      </Col>
                    </Row>
                    {/* </Form.Item> */}
                  </Col>
                  <Col span={24} style={{ borderBottom: "1px solid gray" }}>
                    <Row>
                      <Col span={7}>
                        <div style={{ marginBottom: "30px" }}>
                          <label>Enter coupon</label>
                          <br></br>
                          <br></br>
                          <Form.Item
                            name="CouponCode"
                            // label="Was there any following transaction in 2022 "
                          >
                            <Input
                              placeholder="Enter Coupon code"
                              style={{ width: "200px" }}
                            />
                          </Form.Item>
                          <Button
                            type="primary"
                            style={{ background: "#1677ff", marginLeft: "5px" }}
                          >
                            Apply
                          </Button>
                        </div>
                      </Col>
                      <Col span={5}>
                        <span style={{ marginLeft: "153px" }}>
                          <strong>Total</strong>
                        </span>
                        <span style={{ marginLeft: "26px" }}>
                          <strong>$0.00</strong>
                        </span>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              )}
            </Form>
          </div>
          <div>
          </div>
          <div style={{ display:"flex" ,float: "right", marginTop: "20px" }}>
            <Button
              // className="noBgBtn"
              onClick={() => prev()}
              type="primary"
              // disabled={page === 0 ? true : false}
              style={ (page === 0)?  { display : 'none' }:{display : 'block' , background: "#30a14e", marginRight: "10px"}}
            >
              Back
            </Button>
            <Button
              // className="themeBtn"
              type="primary"
              style={{ background: "#30a14e" }}
              htmlType="submit"
              onClick={() => next()}
            >
              {buttonSet}
            </Button>
          </div>
          <div style={{ height: "60px" }}></div>
        </div>
      </div>
    </div>
  );
};

export default FormContaner;
