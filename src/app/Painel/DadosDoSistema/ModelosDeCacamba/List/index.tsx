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

const ModelosDeCacambaList = ({ type, path, permission }: PageDefaultProps) => {
  // ESTADOS DO COMPONENTE
  const [action, setAction] = useState(false);

  // DEFINE COLUNAS DA TABELA
  const column = [
    {
      title: "Foto",
      dataIndex: "photo",
      table: "photo",
      width: "100px",
      sorter: false,
      align: "center",
      render: (item: any) => <img src={item.photo} width="100%" />,
    },
    {
      title: "Capacidade",
      dataIndex: "m3",
      table: "m3",
      width: "120px",
      sorter: true,
      align: "center",
      render: null,
    },
    {
      title: "Modelo",
      dataIndex: "name",
      table: "name",
      width: "auto",
      sorter: true,
      align: "left",
      render: null,
    },
    {
      title: "A",
      dataIndex: "letter_a",
      table: "letter_a",
      width: "90px",
      sorter: true,
      align: "center",
      render: null,
    },
    {
      title: "B",
      dataIndex: "letter_b",
      table: "letter_b",
      width: "90px",
      sorter: true,
      align: "center",
      render: null,
    },
    {
      title: "C",
      dataIndex: "letter_c",
      table: "letter_c",
      width: "90px",
      sorter: true,
      align: "center",
      render: null,
    },
    {
      title: "D",
      dataIndex: "letter_d",
      table: "letter_d",
      width: "90px",
      sorter: true,
      align: "center",
      render: null,
    },
    {
      title: "E",
      dataIndex: "letter_e",
      table: "letter_e",
      width: "90px",
      sorter: true,
      align: "center",
      render: null,
    },
    {
      title: "F",
      dataIndex: "letter_f",
      table: "letter_f",
      width: "90px",
      sorter: true,
      align: "center",
      render: null,
    },
    {
      title: "Ações",
      dataIndex: null,
      width: "100px",
      sorter: false,
      align: "center",
      render: (item: any) => (
        <Row justify={"center"} style={{ width: "100%" }}>
          <TableTrEditButton type={type} permission={permission} item={item} />
          <TableTrTrashButton
            type={type}
            permission={permission}
            item={item}
            action={() => setAction(!action)}
            path={path}
          />
          <TableTrRecoverButton
            type={type}
            permission={permission}
            item={item}
            action={() => setAction(!action)}
            path={path}
          />
        </Row>
      ),
    },
  ];

  return (
    <PageDefault
      valid={`${permission}.${type}`}
      items={[
        {
          title: (
            <Link to={type === "list" ? "#" : ".."}>Modelos de Caçamba</Link>
          ),
        },
        { title: type === "list" ? "Lista" : "Lixeira" },
      ]}
      options={
        <Row justify={"end"} gutter={[8, 8]}>
          <TableNewButton type={type} permission={permission} />
          <TableTrashButton type={type} permission={permission} />
          <TableReturnButton type={type} permission={permission} />
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

export default ModelosDeCacambaList;
