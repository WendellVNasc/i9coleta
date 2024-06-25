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

const CidadeList = ({ type, path, permission }: PageDefaultProps) => {
  // ESTADOS DO COMPONENTE
  const [action, setAction] = useState(false);

  // DEFINE COLUNAS DA TABELA
  const column = [
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
      title: "Estado",
      dataIndex: "state.name",
      table: "state.acronym",
      width: "150px",
      sorter: true,
      align: "left",
      render: null,
    },
    {
      title: "IBGE",
      dataIndex: "ibge_code",
      table: "city.inbe_code",
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
        { title: <Link to={type === "list" ? "#" : ".."}>Cidades</Link> },
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
            <Table
              column={column}
              path={path}
              type={type}
              action={action}
              useFilter={[
                {
                  type: "search",
                  name: "state",
                  label: "Estado",
                  url: "/state",
                  labelField: ["acronym", "name"],
                },
              ]}
            />
          </CardItem>
        </Col>
      </Row>
    </PageDefault>
  );
};

export default CidadeList;
