// BIBLIOTECAS REACT
import { useRef, useState } from "react"
import { Avatar, Button, Carousel, Col, Pagination, Row, Typography } from "antd";

// CSS
import './styles.css';
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

// INTERFACE
interface GraphUltimosComentariosInterface {
    filters?: any,
    height?: string
}

const GraphUltimosComentarios = ( { filters, height } : GraphUltimosComentariosInterface ) => {

    // REF GRAFICO
    const thisGraph = useRef<any>()

    // ESTADOS DO COMPONENTE
    const [ page, setPage ] = useState(1);

    // LISTA
    const list:any[] = [
        { cliente: 'Fulano de tal disse', data: 'em 09/10/2023', text: 'Lorem ipsum dolor sit amet. Qui laboriosam ullam At magnam iusto et fugiat expedita et dolor consequuntur ut optio sapiente quo sint minima id itaque adipisci? Ut totam aperiam sed dolores culpa aut suscipit dolores id velit nihil ut deleniti culpa.', avatar: 'https://img.freepik.com/fotos-gratis/avatar-androgino-de-pessoa-queer-nao-binaria_23-2151100265.jpg?size=338&ext=jpg&ga=GA1.1.2082370165.1716076800&semt=ais_user' },
        { cliente: 'Cicrano de tal disse', data: 'em 22/11/2023', text: 'Est maiores enim eos repellendus mollitia quo veniam illo eos nobis vero aut dolorem totam ut facilis quod aut culpa saepe. Ea molestiae placeat id esse ipsum eos voluptatibus molestias. Vel velit cumque aut molestias voluptate et sunt nulla eum autem ipsa et quos debitis sed voluptatem consequuntur qui eius ducimus! Et sint molestiae sed assumenda voluptatem sed galisum veritatis et illo aliquid?', avatar: 'https://thumbs.dreamstime.com/b/modelo-adulto-masculino-atrativo-considerável-da-pessoa-dos-retratos-próximos-de-face-para-cima-expressão-tiros-autumn-season-134123931.jpg' },
        { cliente: 'Beltrano de tal disse', data: 'em 23/01/2024', text: 'Eum nihil internos et quibusdam quibusdam aut quis blanditiis. Eos internos ducimus a accusamus voluptatum est enim praesentium qui quia fuga est perspiciatis voluptas rem eligendi quisquam sed repudiandae fuga.', avatar: 'https://marketplace.canva.com/EAFvwKT4hbQ/1/0/1600w/canva-foto-de-perfil-para-facebook-simples-elegante-degradê-azul-preto-e-branco-XUOOnYPlf0Q.jpg' },
    ]

    return (
        <div style={{height: height, overflow: 'hidden'}} ref={thisGraph}>
            { list.length > 0 ? (
                <Row gutter={[8,8]}>
                    <Col flex={'5em'}>
                        <Avatar className="dsh-cmt-avatar" src={list[page-1].avatar} />
                    </Col>
                    <Col flex={'auto'}>
                        <Typography className="dsh-cmt-name">{list[page-1].cliente}</Typography>
                        <Typography className="dsh-cmt-date">{list[page-1].data}</Typography>
                    </Col>
                    <Col span={24}>
                        <Typography className="dsh-cmt-text">{list[page-1].text}</Typography>
                    </Col>
                </Row>
            ) : <Typography>Não há comentários novos</Typography> }
            { list.length > 0 ? (
                <Row className="dsh-cmt-footer no-select" justify={'space-between'} align={'bottom'}>
                    <Col>
                        <Row gutter={[8,8]} align={'middle'}>
                            <Col style={{height: 18}}><IoChevronBack onClick={ () => setPage( page === 1 ? list.length : page-1 ) } className="dsh-cmt-arrow" /></Col>
                            <Col>{page}</Col>
                            <Col>/</Col>
                            <Col>{list.length}</Col>
                            <Col style={{height: 18}}><IoChevronForward onClick={ () => setPage( page === list.length ? 1 : page+1 ) } className="dsh-cmt-arrow" /></Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row gutter={[8,8]} align={'middle'}>
                            <Col> <Button type="default"> Marcar como lida </Button> </Col>
                            <Col> <Button type="primary"> Responder </Button> </Col>
                        </Row>
                    </Col>
                </Row>
            ) : null }
        </div>
    )

}

export default GraphUltimosComentarios