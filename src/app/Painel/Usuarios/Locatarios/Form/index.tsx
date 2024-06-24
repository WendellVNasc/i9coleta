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
import { use } from "echarts";

const LocatariosForm = ({ type, path, permission }: PageDefaultProps) => {
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
        .then((res) => {
          setDoc(String(res.data.document_number).length > 15);
          setCity({ ID: res.data.city_id });
          form.setFieldsValue(res.data);
        })
        .catch(POST_CATCH)
        .finally(() => setLoad(false));
    }
  }, [type, path, form, ID]);

  // FUNÇÃO SALVAR
  const onSend = (values: any) => {
    setLoadButton(true);
    POST_API(`/${path}`, values, ID)
      .then((rs) => {
        if (rs.ok) {
          return rs.json();
        } else {
          Modal.warning({ title: "Algo deu errado", content: rs.statusText });
        }
      })
      .then((data) => {
        message.success("Salvo com sucesso!");
        navigate("..");
      })
      .catch(POST_CATCH)
      .finally(() => setLoadButton(false));
  };

  // FUNÇÃO BUSCAR CEP
  const onCEP = () => {
    setLoadCEP(true);
    GET_API(`/cep/${form.getFieldValue("zip_code")}`)
      .then((rs) => {
        if (rs.ok) {
          return rs.json();
        } else {
          Modal.warning({ title: "Algo deu errado", content: rs.statusText });
        }
      })
      .then((res) => {
        form.setFieldValue("street", res.logradouro);
        form.setFieldValue("district", res.bairro);
        setCity({ search: res.localidade, filters: { uf: res.uf } });
        // form.setFieldsValue(res.data);
      })
      .catch(POST_CATCH)
      .finally(() => setLoadCEP(false));
  };

  useEffect(() => {
    form.setFieldValue("document_number", "");
  }, [doc]);

  return (
    <PageDefault
      valid={`${permission}.${type}`}
      items={[
        { title: <Link to={type === "list" ? "#" : ".."}>Locatários</Link> },
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
                      name="document_number"
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
                          name="name"
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
                          name="name"
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
                      name="email"
                      label="E-mail Principal"
                      rules={[
                        { required: true, message: "Campo obrigatório!" },
                      ]}
                    >
                      <Input placeholder="E-mail Principal" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={7}>
                    <Form.Item name="secondary_email" label="E-mail Secundário">
                      <Input placeholder="E-mail Secundário" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={5}>
                    <Form.Item
                      name="phone"
                      label="Telefone Principal"
                      rules={[
                        { required: true, message: "Campo obrigatório!" },
                      ]}
                    >
                      <Input placeholder="Telefone Principal" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={5}>
                    <Form.Item
                      name="secondary_phone"
                      label="Telefone Secundário"
                    >
                      <Input placeholder="Telefone Secundário" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={3}>
                    <Form.Item
                      name="zip_code"
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
                      name="street"
                      label="Logradouro"
                      rules={[
                        { required: true, message: "Campo obrigatório!" },
                      ]}
                    >
                      <Input placeholder="Logradouro" disabled={loadCEP} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={4}>
                    <Form.Item name="number" label="Número">
                      <Input placeholder="Número" disabled={loadCEP} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={10}>
                    <Form.Item
                      name="district"
                      label="Bairro"
                      rules={[
                        { required: true, message: "Campo obrigatório!" },
                      ]}
                    >
                      <Input placeholder="Bairro" disabled={loadCEP} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={10}>
                    <Form.Item
                      name="city_id"
                      label="Cidade - Estado"
                      rules={[
                        { required: true, message: "Campo obrigatório!" },
                      ]}
                    >
                      <SelectSearch
                        placeholder="Cidade"
                        effect={city}
                        disabled={loadCEP}
                        url="/city"
                        value={form.getFieldValue("city_id")}
                        change={(v: any) =>
                          form.setFieldValue("city_id", v.value)
                        }
                        labelField={["name", "state.acronym"]}
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

export default LocatariosForm;
