// BIBLIOTECAS REACT
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Col, Form, Input, Modal, Row, message } from "antd";
import { TableReturnButton } from "../../../../../components/Table/buttons";

// SERVIÇOS
import {
  GET_API,
  POST_API,
  POST_CATCH,
  PageDefaultProps,
  getToken,
} from "../../../../../services";

// COMPONENTES
import PageDefault from "../../../../../components/PageDefault";
import CardItem from "../../../../../components/CardItem";
import LoadItem from "../../../../../components/LoadItem";

const TiposDeVeiculosForm = ({ type, path, permission }: PageDefaultProps) => {
  // RESPONSAVEL PELA ROTA
  const navigate = useNavigate();

  // PARAMETROS
  const { ID } = useParams();

  // ESTADOS DO COMPONENTE
  const [load, setLoad] = useState(true);
  const [loadButton, setLoadButton] = useState(false);

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

  return (
    <PageDefault
      valid={`${permission}.${type}`}
      items={[
        {
          title: (
            <Link to={type === "list" ? "#" : ".."}>Tipos de Veículos</Link>
          ),
        },
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
                  <Col xs={24} md={24}>
                    <Form.Item
                      name="name"
                      label="Tipo"
                      rules={[
                        { required: true, message: "Campo obrigatório!" },
                      ]}
                    >
                      <Input placeholder="Tipo" />
                    </Form.Item>
                  </Col>
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

export default TiposDeVeiculosForm;
