import { Col, Form, Image, Input, Row, Select } from "antd";
import React, { useEffect, useState } from "react";

import logo from "../../assets/images/logos/Logo Completa/PNG_.Completa - Fundo Transparente.png";
import {
  GET_API,
  POST_CATCH,
  getToken,
  setConfig,
  setProfile,
} from "../../services";
import { useNavigate } from "react-router-dom";

const ProfileModal: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [url, setUrl] = useState(window.location.href.split("/")[4]);
  const handleProfileSelect = (profile: string) => {};
  const [profiles, setProfiles] = useState([{ id: 1, type: "" }]);

  useEffect(() => {
    if (getToken() != null) {
      GET_API("/me").then((response) => {
        if (!response.ok) {
          POST_CATCH();
        }
        response.json().then((data) => {
          let profiles = data.data.profiles;
          console.log(profiles[0].id);
          if (data.data.profiles.length === 1) {
            setProfile(`${profiles[0].id}`);
            setConfig(JSON.stringify(profiles[0].permissions));
            navigate("/painel");
          }

          setProfiles(profiles);
        });
      });
    } else {
      navigate("/");
    }
  }, [url]);

  const onSend = async (values: any) => {};

  const handleConfirm = () => {};

  return (
    <Row className="content-login">
      <Col span={24} className="col-login">
        <div className="card-login">
          <Row>
            <Col span={24}>
              <Image preview={false} src={logo} />
            </Col>
            <Form style={{ width: "100%" }} onFinish={onSend} form={form}>
              <Form.Item name="profile" label="Perfil">
                <Select onChange={handleProfileSelect}>
                  {profiles.map((profile: any) => (
                    <Select.Option key={profile.id}>
                      {profile.type}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </Row>
        </div>
      </Col>
    </Row>
  );
};

export default ProfileModal;
