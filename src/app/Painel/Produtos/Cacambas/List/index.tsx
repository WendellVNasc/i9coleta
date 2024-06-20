// BIBLIOTECAS REACT
import { useState } from "react";
import { Link } from "react-router-dom";
import { Carousel, Col, Image, Row, Typography } from "antd";

// SERVIÇOS
import { PageDefaultProps, verifyConfig } from "../../../../../services";

// COMPONENTES
import PageDefault from "../../../../../components/PageDefault";
import CardItem from "../../../../../components/CardItem";
import Table from "../../../../../components/Table";
import {
  TableNewButton,
  TableReturnButton,
  TableTrCartButton,
  TableTrEditButton,
  TableTrGalleryButton,
  TableTrQrCodeButton,
  TableTrRecoverButton,
  TableTrTrashButton,
  TableTrashButton,
} from "../../../../../components/Table/buttons";

const CacambasList = ({ type, path, permission }: PageDefaultProps) => {
  // ESTADOS DO COMPONENTE
  const [action, setAction] = useState(false);

  // DEFINE COLUNAS DA TABELA
  const column = [
    {
      title: "Fotos",
      dataIndex: "gallery",
      table: "created_at",
      width: "80px",
      sorter: true,
      align: "center",
      render: (item: any) => (
        <Row justify={"center"} style={{ width: "100%" }}>
          <Carousel
            autoplay
            style={{ width: "60px" }}
            arrows={item.gallery.length > 1}
            dots={item.gallery.length > 1}
          >
            {item.gallery.map((v: any, i: any) => (
              <div key={i}>
                <Image preview={false} src={v.url} width={"100%"} />
              </div>
            ))}
          </Carousel>
        </Row>
      ),
    },
    {
      title: "Locador",
      dataIndex: "provider_name",
      table: "provider_name",
      width: "auto",
      minWidth: "300px",
      sorter: true,
      align: "left",
      render: null,
      hide: !verifyConfig("lcd.list"),
    },
    {
      title: "Tipo Locação",
      dataIndex: "type_local_name",
      table: "type_local_name",
      width: "180px",
      sorter: true,
      align: "center",
      render: null,
    },
    {
      title: "Preço Locação",
      dataIndex: "price_external",
      table: "price_external",
      width: "180px",
      sorter: true,
      align: "left",
      render: (item: any) => (
        <div style={{ width: "100%" }}>
          <Typography>
            Loc. Externa:{" "}
            <span style={{ color: "var(--color01)", float: "right" }}>
              {item.price_external}
            </span>
          </Typography>
          <Typography>
            Loc. Interna:{" "}
            <span style={{ color: "var(--color01)", float: "right" }}>
              {item.price_internal}
            </span>
          </Typography>
        </div>
      ),
    },
    {
      title: "Dias Locação",
      dataIndex: "DAYS_EXTERNAL",
      table: "stationary_bucket_group.DAYS_EXTERNAL",
      width: "180px",
      sorter: true,
      align: "left",
      render: (item: any) => (
        <div style={{ width: "100%" }}>
          <Typography>
            Loc. Externa:{" "}
            <span style={{ color: "var(--color01)", float: "right" }}>
              Até {item.DAYS_EXTERNAL} dias
            </span>
          </Typography>
          <Typography>
            Loc. Interna:{" "}
            <span style={{ color: "var(--color01)", float: "right" }}>
              Até {item.DAYS_INTERNAL} dias
            </span>
          </Typography>
        </div>
      ),
    },
    {
      title: "Modelo",
      dataIndex: "stationary_bucket_type.name",
      table: "stationary_bucket_type.name",
      width: "140px",
      sorter: true,
      align: "center",
      render: null,
    },
    {
      title: "Tampa",
      dataIndex: "type_lid_name",
      table: "type_lid",
      width: "140px",
      sorter: true,
      align: "center",
      render: null,
    },
    {
      title: "Cores",
      dataIndex: "color",
      table: "color",
      width: "140px",
      sorter: true,
      align: "center",
      render: null,
    },
    {
      title: "Disponíveis",
      dataIndex: "STOCK",
      table: "stationary_bucket_group.COLOR",
      width: "auto",
      minWidth: "140px",
      sorter: true,
      align: "center",
      render: null,
    },
    {
      title: "Ações",
      dataIndex: null,
      width: "120px",
      sorter: false,
      align: "center",
      render: (item: any) => (
        <Row justify={"center"} style={{ width: "100%" }}>
          <TableTrCartButton type={type} permission={permission} item={item} />
          <TableTrGalleryButton
            type={type}
            permission={permission}
            item={item}
          />
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
        { title: <Link to={type === "list" ? "#" : ".."}>Caçambas</Link> },
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
            <Table
              column={column}
              path={path}
              type={type}
              action={action}
              useFilter={
                verifyConfig("lcd.list")
                  ? [
                      {
                        type: "search",
                        name: "provider",
                        label: "Locador",
                        url: "/provider",
                        labelField: "name",
                      },
                      {
                        type: "search",
                        name: "type",
                        label: "Modelo",
                        url: "/stationary_bucket_type",
                        labelField: "name",
                      },
                    ]
                  : [
                      {
                        type: "search",
                        name: "type",
                        label: "Modelo",
                        url: "/stationary_bucket_type",
                        labelField: "name",
                      },
                    ]
              }
            />
          </CardItem>
        </Col>
      </Row>
    </PageDefault>
  );
};

export default CacambasList;
