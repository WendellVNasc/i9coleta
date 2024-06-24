// BIBLIOTECAS REACT
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Col, Form, Input, Modal, Row, Switch, message } from "antd";
import { TableReturnButton } from "../../../../../components/Table/buttons";

// SERVIÇOS
import {
  GET_API,
  MaskCEP,
  MaskCNPJ,
  MaskCPF,
  POST_API,
  POST_CATCH,
  PageDefaultProps,
  getToken,
} from "../../../../../services";

// COMPONENTES
import PageDefault from "../../../../../components/PageDefault";
import CardItem from "../../../../../components/CardItem";
import LoadItem from "../../../../../components/LoadItem";
import SelectSearch from "../../../../../components/SelectSearch";

const LocadoresForm = ({ type, path, permission }: PageDefaultProps) => {
  // RESPONSAVEL PELA ROTA
  const navigate = useNavigate();

  // PARAMETROS
  const { ID } = useParams();

  // ESTADOS DO COMPONENTE
  const [load, setLoad] = useState(true);
  const [loadButton, setLoadButton] = useState(false);
  const [loadCEP, setLoadCEP] = useState(false);
  const [city, setCity] = useState<any>(null);
  const [state, setState] = useState<any>(null);
  const [doc, setDoc] = useState(false);

  // CAMPOS FORMULARIO
  const [form] = Form.useForm();

  // VERIFICA "NOVO" OU "EDITAR"
  useEffect(() => {
    if (type === "add") {
      setLoad(false);
    } else {
      setLoad(true);
      GET_API(`/${path}/${ID}`)
        .then((rs) => {
          if (rs.ok) {
            return rs.json();
          } else {
            Modal.warning({ title: "Algo deu errado", content: rs.statusText });
          }
        })
        .then((res) => {    G
          form.setFieldsValue(res.data);
        })
        .catch(POST_CATCH)
        .finally(() => setLoad(false));
      // POST_API(`/${path}/search.php`, { token: getToken(), filter: JSON.stringify({ ID: ID }), type }).then(rs => rs.json()).then(res => {
      //     if (res.return) {
      //         setDoc(String(res.data[0].LOGIN).length > 15)
      //         setTimeout(() => {
      //             setState({ID: res.data[0].STATE_ID})
      //             setCity({ID: res.data[0].CITY_ID})
      //             form.setFieldsValue(res.data[0])
      //         }, 500);
      //     } else { Modal.warning({ title: 'Algo deu errado', content: res.msg }) }
      // }).catch(POST_CATCH).finally( () => setLoad(false))
    }
  }, [type, path, form, ID]);

  // FUNÇÃO SALVAR
  const onSend = (values: any) => {
    setLoadButton(true);
    values.ID = ID;
    POST_API(`/${path}/save.php`, {
      token: getToken(),
      master: JSON.stringify(values),
    })
      .then((rs) => rs.json())
      .then((res) => {
        if (res.return) {
          message.success(res.msg);
          navigate("..");
        } else {
          Modal.warning({ title: "Algo deu errado", content: res.msg });
        }
      })
      .catch(POST_CATCH)
      .finally(() => setLoadButton(false));
  };

  // FUNÇÃO BUSCAR CEP
  const onCEP = () => {
    setLoadCEP(true);
    POST_API("/cep/search.php", {
      token: getToken(),
      master: JSON.stringify({ CEP: form.getFieldValue("CEP") }),
    })
      .then((rs) => rs.json())
      .then((res) => {
        if (res.return) {
          form.setFieldValue("STREET", res.data.nome_logradouro);
          form.setFieldValue("DISTRICT", res.data.bairro);
          setState({ ACRONYM: res.data.uf });
          setCity({ search: res.data.nome_localidade + " - " + res.data.uf });
        } else {
          Modal.warning({ title: "Algo deu errado", content: res.msg });
        }
      })
      .catch(POST_CATCH)
      .finally(() => setLoadCEP(false));
  };

  useEffect(() => {
    form.setFieldValue("LOGIN", "");
  }, [doc]);

  return (
    <PageDefault
      valid={`${permission}.${type}`}
      items={[
        { title: <Link to={type === "list" ? "#" : ".."}>Locadores</Link> },
        { title: type === "add" ? "Novo" : "Editar" },
      ]}
      options={
        <Row justify={"end"} gutter={[8, 8]}>
          <TableReturnButton type={type} permission={permission} />
        </Row>
      }
    >
      <Row gutter={[16, 16]}>
        <Col md={24} xs={24}>
          {load ? (
            <LoadItem />
          ) : (
            <CardItem>
              <Form layout="vertical" form={form} onFinish={onSend}>
                <Row gutter={[8, 8]}>
                  <Col xs={24} md={6}>
                    <Form.Item
                      name="LOGIN"
                      label="Login"
                      rules={[
                        { required: true, message: "Campo obrigatório!" },
                      ]}
                    >
                      <Input
                        disabled={type === "edit"}
                        placeholder="Login"
                        autoComplete="off"
                        maxLength={doc ? 18 : 14}
                        onKeyDown={doc ? MaskCNPJ : MaskCPF}
                        addonAfter={
                          <Switch
                            size="small"
                            checkedChildren="CNPJ"
                            unCheckedChildren="CPF"
                            onChange={setDoc}
                            checked={doc}
                            disabled={type === "edit"}
                          />
                        }
                      />
                    </Form.Item>
                  </Col>
                  {doc ? (
                    <>
                      <Col xs={24} md={10}>
                        <Form.Item
                          name="NAME"
                          label="Razão Social"
                          rules={[
                            { required: true, message: "Campo obrigatório!" },
                          ]}
                        >
                          <Input placeholder="Razão Social" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={8}>
                        <Form.Item name="FANTASY" label="Nome Fantasia">
                          <Input placeholder="Nome Fantasia" />
                        </Form.Item>
                      </Col>
                    </>
                  ) : (
                    <>
                      <Col xs={24} md={18}>
                        <Form.Item
                          name="NAME"
                          label="Nome"
                          rules={[
                            { required: true, message: "Campo obrigatório!" },
                          ]}
                        >
                          <Input placeholder="Nome" />
                        </Form.Item>
                      </Col>
                    </>
                  )}
                  <Col xs={24} md={7}>
                    <Form.Item
                      name="EMAIL_01"
                      label="E-mail Principal"
                      rules={[
                        { required: true, message: "Campo obrigatório!" },
                      ]}
                    >
                      <Input placeholder="E-mail Principal" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={7}>
                    <Form.Item name="EMAIL_02" label="E-mail Secundário">
                      <Input placeholder="E-mail Secundário" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={5}>
                    <Form.Item
                      name="PHONE_01"
                      label="Telefone Principal"
                      rules={[
                        { required: true, message: "Campo obrigatório!" },
                      ]}
                    >
                      <Input placeholder="Telefone Principal" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={5}>
                    <Form.Item name="PHONE_02" label="Telefone Secundário">
                      <Input placeholder="Telefone Secundário" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={3}>
                    <Form.Item
                      name="CEP"
                      label="CEP"
                      rules={[
                        { required: true, message: "Campo obrigatório!" },
                      ]}
                    >
                      <Input
                        placeholder="CEP"
                        onKeyDown={MaskCEP}
                        maxLength={9}
                        onBlur={onCEP}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={21}>
                    <Form.Item
                      name="STREET"
                      label="Logradouro"
                      rules={[
                        { required: true, message: "Campo obrigatório!" },
                      ]}
                    >
                      <Input placeholder="Logradouro" disabled={loadCEP} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={4}>
                    <Form.Item name="NUMB" label="Número">
                      <Input placeholder="Número" disabled={loadCEP} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={10}>
                    <Form.Item
                      name="DISTRICT"
                      label="Bairro"
                      rules={[
                        { required: true, message: "Campo obrigatório!" },
                      ]}
                    >
                      <Input placeholder="Bairro" disabled={loadCEP} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={7}>
                    <Form.Item
                      name="CITY_ID"
                      label="Cidade"
                      rules={[
                        { required: true, message: "Campo obrigatório!" },
                      ]}
                    >
                      <SelectSearch
                        effect={city}
                        placeholder="Cidade"
                        disabled={loadCEP}
                        url="/city/select.php"
                        value={form.getFieldValue("CITY_ID")}
                        change={(v: any) =>
                          form.setFieldValue("CITY_ID", v.value)
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={3}>
                    <Form.Item
                      name="STATE_ID"
                      label="Estado"
                      rules={[
                        { required: true, message: "Campo obrigatório!" },
                      ]}
                    >
                      <SelectSearch
                        effect={state}
                        placeholder="Estado"
                        disabled={loadCEP}
                        url="/state/select.php"
                        value={form.getFieldValue("STATE_ID")}
                        change={(v: any) =>
                          form.setFieldValue("STATE_ID", v.value)
                        }
                      />
                    </Form.Item>
                  </Col>
                  {doc ? (
                    <>
                      <Col xs={24} md={8}>
                        <Form.Item name="RESPONSIBLE_NAME" label="Resp. - Nome">
                          <Input placeholder="Resp. - Nome" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={4}>
                        <Form.Item name="RESPONSIBLE_CPF" label="Resp. - CPF">
                          <Input
                            placeholder="Resp. - CPF"
                            onKeyDown={MaskCPF}
                            maxLength={14}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={6}>
                        <Form.Item
                          name="RESPONSIBLE_OFFICE"
                          label="Resp. - Cargo"
                        >
                          <Input placeholder="Resp. - Cargo" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={6}>
                        <Form.Item
                          name="RESPONSIBLE_DEPARTAMENT"
                          label="Resp. - Departamento"
                        >
                          <Input placeholder="Resp. - Departamento" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={7}>
                        <Form.Item
                          name="RESPONSIBLE_EMAIL_01"
                          label="Resp. - E-mail Principal"
                        >
                          <Input placeholder="Resp. - E-mail Principal" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={7}>
                        <Form.Item
                          name="RESPONSIBLE_EMAIL_02"
                          label="Resp. - E-mail Secundário"
                        >
                          <Input placeholder="Resp. - E-mail Secundário" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={5}>
                        <Form.Item
                          name="RESPONSIBLE_PHONE_01"
                          label="Resp. - Telefone Principal"
                        >
                          <Input placeholder="Resp. - Telefone Principal" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={5}>
                        <Form.Item
                          name="RESPONSIBLE_PHONE_02"
                          label="Resp. - Telefone Secundário"
                        >
                          <Input placeholder="Resp. - Telefone Secundário" />
                        </Form.Item>
                      </Col>
                    </>
                  ) : null}
                  <Col span={24}>
                    <Button
                      shape="round"
                      htmlType="submit"
                      type="primary"
                      style={{ float: "right", marginLeft: 6 }}
                      loading={loadButton}
                    >
                      Salvar
                    </Button>
                    <Link to={".."}>
                      <Button
                        shape="round"
                        type="default"
                        style={{ float: "right" }}
                      >
                        Cancelar
                      </Button>
                    </Link>
                  </Col>
                </Row>
              </Form>
            </CardItem>
          )}
        </Col>
      </Row>
    </PageDefault>
  );
};

export default LocadoresForm;
