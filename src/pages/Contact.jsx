import { Form, Input, Button, Row, Col, message, Select } from "antd";
import { SectionTitle } from "./Card";

const { TextArea } = Input;

export default function Contact({ id = "contact-us" }) {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log(values);
    message.success("Message sent!");
    form.resetFields();
  };

  return (
    <section id={id} className="mx-auto max-w-6xl px-6 py-24">
        <SectionTitle title="Contact Us" description="Can't wait to start? Have questions for us?"/>

        <div className="mx-auto max-w-2xl mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label={<span className="text-white/80">First Name</span>}
                            name="firstName"
                            rules={[{ required: true, message: "Required" }]}
                        >
                            <Input placeholder="John" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            label={<span className="text-white/80">Last Name</span>}
                            name="lastName"
                            rules={[{ required: true, message: "Required" }]}
                        >
                            <Input placeholder="Doe"/>
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            label={<span className="text-white/80">Email</span>}
                            name="email"
                            rules={[
                            { required: true, message: "Required" },
                            { type: "email", message: "Invalid email" },
                            ]}
                        >
                            <Input placeholder="example@gmail.com"/>
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            label={<span className="text-white/80">Phone</span>}
                            name="phone"
                        >
                            <Input placeholder="+61 123 4567"/>
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            label={<span className="text-white/80">Request Type</span>}
                            name="requestType"
                            rules={[{ required: true, message: "Please select a request type" }]}
                        >
                            <Select
                            placeholder="Select one"
                            options={[
                                { value: "early-access", label: "Early Access" },
                                { value: "bug-report", label: "Bug Report" },
                                { value: "others", label: "Other Request" },
                            ]}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24}>
                        <Form.Item
                            label={<span className="text-white/80">Message</span>}
                            name="message"
                            rules={[{ required: true, message: "Required" }]}
                        >
                            <TextArea rows={4} />
                        </Form.Item>
                    </Col>

                </Row>

                <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                    <Button type="primary" htmlType="submit">
                        Send Message
                    </Button>
                </div>
            </Form>
        </div>
    </section>
  );
}
