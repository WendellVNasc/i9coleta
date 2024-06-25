// BIBLIOTECAS REACT
import { useState } from "react";
import { Link } from "react-router-dom";
import { Col, Row } from "antd";

// SERVIÇOS
import { PageDefaultProps } from "../../../../../services";

// COMPONENTES
import PageDefault from "../../../../../components/PageDefault";
import CardItem from "../../../../../components/CardItem";
import Table from "../../../../../components/Table";
import {
  TableNewButton,
  TableReturnButton,
  TableTrEditButton,
  TableTrRecoverButton,
  TableTrTrashButton,
  TableTrashButton,
} from "../../../../../components/Table/buttons";

const EstadosList = ({ type, path, permission }: PageDefaultProps) => {
  // ESTADOS DO COMPONENTE
  const [action, setAction] = useState(false);

  // DEFINE COLUNAS DA TABELA
  const column = [
    {
      title: "Sigla",
      dataIndex: "acronym",
      table: "acronym",
      width: "80px",
      sorter: true,
      align: "center",
      render: null,
    },
    {
      title: "Nome",
      dataIndex: "name",
      table: "name",
      width: "auto",
      sorter: true,
      align: "left",
      render: null,
    },
    {
      title: "IBGE",
      dataIndex: "ibge_code",
      table: "ibge_code",
      width: "100px",
      sorter: true,
      align: "center",
      render: null,
    },
  ];

  return (
    <PageDefault
      valid={`${permission}.${type}`}
      items={[
        { title: <Link to={type === "list" ? "#" : ".."}>Estados</Link> },
        { title: type === "list" ? "Lista" : "Lixeira" },
      ]}
      options={
        <Row justify={"end"} gutter={[8, 8]}>
        </Row>
      }
    >
      <Row gutter={[16, 16]}>
        <Col md={24} xs={24}>
          <CardItem>
            <Table column={column} path={path} type={type} action={action} />
          </CardItem>
        </Col>
      </Row>
    </PageDefault>
  );
};

export default EstadosList;
