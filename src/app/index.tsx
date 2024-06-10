// BIBLIOTECAS REACT
import { useEffect, useRef, useState } from 'react';
import { Button, Col, Drawer, Image, Layout, Row, Typography } from 'antd';
import { Link } from 'react-router-dom';

// ICONES
import { IoMenuOutline } from 'react-icons/io5';

// IMAGES
import logo1 from '../assets/images/logos/Tipografia/PNG_.Tipografia Branca - Fundo Transparente.png';
import logo2 from '../assets/images/logos/Tipografia/PNG_.Tipografia Rosa.png';
import image1 from '../assets/images/site/Group-2-1.png';
import image2 from '../assets/images/site/Banner-cacamba-1.png';
import image3 from '../assets/images/site/5785136-01-1-1.png';
import image4 from '../assets/images/site/Icone-1.png';
import image5 from '../assets/images/site/Icone-1-1.png';
import image6 from '../assets/images/site/Icone-1-2.png';
import image7 from '../assets/images/site/Icone-1-3.png';
import image8 from '../assets/images/site/Icone-1-4.png';
import image9 from '../assets/images/site/Apps-I9-02-1.png';
import image10 from '../assets/images/site/Group-26-1.png';
import image11 from '../assets/images/site/Box-Image.png';
import image12 from '../assets/images/site/Box-Image-1.png';
import image13 from '../assets/images/site/Box-Image-2.png';

const Landing = () => {

    // ESTADOS DO COMPONENTE
    const [ scrl, setScrl ] = useState(false);
    const [ menu, setMenu ] = useState(false);

    // REFERENCIAS
    const refInicio = useRef<any>()
    const refSobre = useRef<any>()
    const refMercado = useRef<any>()
    const refSolucoes = useRef<any>()
    const refFundadores = useRef<any>()
    const refContato = useRef<any>()
    const refLocador = useRef<any>()

    // FUNÇÃO REFERENCIA
    const toRef = (ref: any) => {
        ref?.current?.scrollIntoView()
    }

    const onMenu = () => setMenu(!menu)

    useEffect(() => {

        // VERIFICA SCROLL DA PAGINA
        document.addEventListener('scroll', (e) => {
            setScrl(window.scrollY > 60)
        })

    }, []);

    return (
        <Layout.Content id="scroll-principal">
            <Row className={ scrl ? 'navbar-landing active' : 'navbar-landing' } align={'middle'} justify={'space-between'}>
                <Col>
                    <Link to={'/'}><Image src={ scrl ? logo2 : logo1 } preview={false} width={120} /></Link>
                </Col>
                <Col className='menus'>
                    <Row align={'middle'}>
                        <Col> <div className='menu-item' onClick={() => toRef(refInicio)}>Início</div> </Col>
                        <Col> <div className='menu-item' onClick={() => toRef(refSobre)}>Sobre</div> </Col>
                        <Col> <div className='menu-item' onClick={() => toRef(refMercado)}>Mercado</div> </Col>
                        <Col> <div className='menu-item' onClick={() => toRef(refSolucoes)}>Soluções</div> </Col>
                        <Col> <div className='menu-item' onClick={() => toRef(refFundadores)}>Fundadores</div> </Col>
                        <Col> <div className='menu-item' onClick={() => toRef(refContato)}>Contato</div> </Col>
                        <Col> <div className='menu-item' onClick={() => toRef(refLocador)}>Cadastro de locadores</div> </Col>
                        <Col> <Link to='login'><Button size='small' type='primary' shape='round'>ENTRAR</Button></Link> </Col>
                    </Row>
                </Col>
                <Col className='menus-out'>
                    <Row>
                        <Col><IoMenuOutline className='icon-menu' size={40} onClick={onMenu} /></Col>
                    </Row>
                </Col>
            </Row>
            <Row className='row-landing' align={'middle'} ref={refInicio}>
                <Col md={12} xs={24}>
                    <Typography className='title-1'>VENHA CRESCER</Typography>
                    <Typography className='title-2'>COM O i9COLETA!</Typography>
                    <Typography className='title-3'>Invista e seja sócio.</Typography>
                    <Button type='primary' shape='round' onClick={() => toRef(refSobre)}>CONHECER MAIS</Button>
                </Col>
                <Col md={12} xs={24}>
                    <Image src={image1} preview={false} />
                </Col>
            </Row>
            <Row className='row-landing-white' align={'middle'} gutter={[16,16]} ref={refSobre}>
                <Col md={12} xs={24}>
                    <Typography className='title-1-white'>SOBRE</Typography>
                    <Typography className='title-2-white'>O i9COLETA</Typography>
                    <Typography className='title-3-white'>Todos os anos, o Brasil descarta cem milhões de toneladas de entulho. Empilhada, essa sujeira toda formaria sete mil prédios de dez andares.</Typography>
                    <Typography className='title-3-white'>Mais de 80% dos municípios brasileiros não tratam de forma adequada o entulho gerado pela construção civil. E isso não é só um problema ambiental, é também um desperdício de dinheiro. (*G1)</Typography>
                    <Typography className='title-3-white'>O i9Coleta é uma plataforma Mobile de locação de caçambas estacionárias, aproximando pessoas físicas ou jurídicas que precisam descartar entulhos, com as empresas que fazem a locação das caçambas e realizam a destinação ambientalmente adequada.</Typography>
                </Col>
                <Col md={12} xs={24}>
                    <Image src={image2} preview={false} />
                </Col>
                <Col span={24} style={{marginTop: 80}}></Col>
                <Col md={16} xs={24}>
                    <Image src={image3} preview={false} />
                </Col>
                <Col md={8} xs={24}>
                    <Typography className='title-1-white'>SOBRE</Typography>
                    <Typography className='title-2-white'>O APLICATIVO</Typography>
                    <Typography className='title-3-white'>A plataforma será composta de 5 aplicativos que irão realizar o processo de ponta a ponta, desde a oferta até a cobertura da destinação final.</Typography>
                </Col>
                <Col span={24} style={{marginTop: 80}}></Col>
                <Col md={4} xs={10}>
                    <Image src={image4} preview={false} />
                </Col>
                <Col md={8} xs={14}>
                    <Typography className='title-1-white'>APLICATIVO</Typography>
                    <Typography className='title-2-white'>CLIENTE FINAL</Typography>
                    <Typography className='title-3-white'>Aplicativo Web/Mobile, onde o cliente poderá encontrar os locadores de caçambas estacionárias, verificar os modelos e valores, realizar a locação, bem como, acompanhar todo o processo.</Typography>
                </Col>
                <Col md={4} xs={10}>
                    <Image src={image5} preview={false} />
                </Col>
                <Col md={8} xs={14}>
                    <Typography className='title-1-white'>APLICATIVO</Typography>
                    <Typography className='title-2-white'>DO MOTORISTA</Typography>
                    <Typography className='title-3-white'>Aplicativo Mobile, destinado aos motoristas transportadores de caçambas estacionárias que auxiliará no gerenciamento dos roteiros de entregas e retiradas das caçambas, assim como, o descarte em destinos ambientalmente corretos dos resíduos.</Typography>
                </Col>
                <Col md={4} xs={10}>
                    <Image src={image6} preview={false} />
                </Col>
                <Col md={8} xs={14}>
                    <Typography className='title-1-white'>APLICATIVO</Typography>
                    <Typography className='title-2-white'>DO LOCADOR DE CAÇAMBAS</Typography>
                    <Typography className='title-3-white'>Aplicativo Web/Mobile, para que as empresa proprietárias de caçambas estacionárias, possam gerenciar as locações e todas as movimentações operacionais, administrativas e financeiras.</Typography>
                </Col>
                <Col md={4} xs={10}>
                    <Image src={image7} preview={false} />
                </Col>
                <Col md={8} xs={14}>
                    <Typography className='title-1-white'>APLICATIVO</Typography>
                    <Typography className='title-2-white'>GESTÃO INTEGRADA</Typography>
                    <Typography className='title-3-white'>Área administrativa da plataforma.</Typography>
                </Col>
                <Col md={4} xs={10}>
                    <Image src={image8} preview={false} />
                </Col>
                <Col md={8} xs={14}>
                    <Typography className='title-1-white'>APLICATIVO</Typography>
                    <Typography className='title-2-white'>DE FISCALIZAÇÃO PÚBLICA</Typography>
                    <Typography className='title-3-white'>Aplicativo Web/Mobile, desenvolvido para atender as necessidades das prefeituras de fiscalizar os locais onde estão estacionadas todas as caçambas, verificar quem locou, a documentação do locador, sua regularidade legal e rastrear qual a destinação dada aos resíduos coletados.</Typography>
                </Col>
            </Row>
            <Row className='row-landing-color' gutter={[16,16]} align={'top'} ref={refMercado}>
                <Col md={12} xs={24}>
                    <Typography className='title-1-color'>MERCADO DE</Typography>
                    <Typography className='title-2-color'>CAÇAMBAS ESTACIONÁRIAS</Typography>
                    <Typography className='title-3-color'>Os principais clientes das empresas de locação de caçamba estacionárias são as construtoras e incorporadoras. As caçambas estacionarias, também, são utilizadas para coleta de outros tipos de resíduos, como podas, limpezas de imóveis, descartes de itens obsoletos etc.</Typography>
                    <Typography className='title-3-color'>Em recente pesquisa realizada no website Empresômetro, existem no Brasil mais de 28.000 empresas de coleta de resíduos não perigosos. Estima-se que no Brasil a média de caçambas é de 75 unidades por empresa, considerando estas informações, o parque de caçambas estacionárias no Brasil deve ser superior 2,1 milhões.</Typography>
                    <Typography className='title-3-color'>O ticket médio para locação de caçambas de 5m³ no Brasil é de R$ 300,00 por um período de no máximo 3 dias. Portanto, se considerarmos que cada caçamba poderá ser locada em até 7 vezes por mês, é notório que estamos tratando de um mercado bilionário.</Typography>
                    <Typography className='title-3-color'>O i9Coleta irá revolucionar e inovar a forma de contratação de caçambas estacionárias, monitorando e controlando todos os processos de locação, destinação dos resíduos, com o objetivo de se tornar a maior plataforma de controle ambiental de resíduos sólidos da construção civil no Brasil.</Typography>
                </Col>
                <Col md={12} xs={24}>
                    <Typography className='title-1-color text-right'>COMO É FEITA A</Typography>
                    <Typography className='title-2-color text-right'>LOCAÇÃO NO MODELO ATUAL</Typography>
                    <Typography className='title-3-color text-right'>O cliente busca na internet, entra em contato telefônico, Whatzapp ou e-mail com as empresas que oferecem o serviço, realiza uma pesquisa de preços, modelos de caçambas e prazo de entrega, sem nenhum controle do processo e garantia que o serviço será realizado no prazo e data que deseja.</Typography>
                    <Typography className='title-3-color text-right'>Uma vez encontrando o locador que atenda aos seus requisitos, a caçamba é enviada até o local indicado pelo cliente, sem que o requisitante tenha nenhuma informação de confirmação da entrega e ou envio.</Typography>
                    <Typography className='title-3-color text-right'>Para entrega ou devolução da caçamba cheia, o usuário tem que ligar para a empresa vir buscá-la e não há controle nenhum sobre esse processo, muito menos, se foi dada a destinação final ambientalmente adequada dos resíduos e se a empresa está cumprindo com as legislações vigentes.</Typography>
                    <Typography className='title-3-color text-right'>Segundo a Lei Federal nº 12.305/2010 - Política Nacional de Resíduos Sólidos, a corresponsabilidade da gestão dos resíduos sólidos cita o envolvimento de todos neste processo e em todas as esferas, sejam elas de administração pública ou de direito privado, que passam ser obrigadas a demostrar o cumprimento da legislação e das boas práticas ambientais.</Typography>
                </Col>
            </Row>
            <Row className='row-landing-white' gutter={[16,16]} align={'top'}>
                <Col md={24} xs={24}>
                    <Typography className='title-1-white'>MODELO</Typography>
                    <Typography className='title-2-white'>REVOLUCIONÁRIO</Typography>
                    <Typography className='title-3-white'>A plataforma permite o cadastramento apenas de empresas licenciadas e que realizam o descarte adequado, destinação final para CTR – Centros de Tratamentos de Resíduos, que fazem o reaproveitamento dos produtos, reciclagem ou descarte em locais ambientalmente corretos. Em resumo, apenas empresas devidamente licenciadas e que cumpram a legislação poderão estar na plataforma, para garantir a segurança do contratante.</Typography>
                    <Typography className='title-3-white'>Os “caçambeiros” (donos das empresas de caçambas estacionárias), através de smartphone ou via web, poderão acessar o aplicativo e cadastrar suas empresas na plataforma i9Coleta, assim como todos os modelos de caçambas e respectivos valores de locação, farão o cadastro dos motoristas e seus números de telefone (estes receberão um link para baixar o aplicativo Motorista), lançar promoções, verificar a quantidade de caçambas locadas e suas localizações, gerenciar os dados de quem efetuou a locação além de outras funcionalidades.</Typography>
                    <Typography className='title-3-white'>O i9Cloleta permite a gestão financeira de todas as locações gerando relatórios das receitas geradas por dia, semana, mês ou ano.</Typography>
                    <Typography className='title-3-white'>Os clientes/usuários, interessados em locar as caçambas estacionárias, deverão acessar o aplicativo i9Coleta através do seu smartphone ou na web, nele será possível visualizar “online” todos os modelos de caçambas disponíveis para o período desejado, pesquisar as melhores opções de valores e efetuar o respectivo pagamento através dos métodos disponíveis no aplicativo (cartão de débito, crédito e pix). Tratamento diferenciado para empresas!</Typography>
                    <Typography className='title-3-white'>Após confirmada a locação, o usuário será notificado e poderá fazer o acompanhamento/rastreamento da movimentação do veículo até o destino solicitado, o aplicativo permite ao locatário informar quando a caçamba estiver cheia, a empresa locadora será notificada eletronicamente para retirar ou fazer a reposição das caçambas. Por fim, o App i9Coleta informa a cliente a destinação que foi dada aos resíduos coletados.</Typography>
                    <Typography className='title-3-white'>Como um bônus, o i9Coleta irá disponibilizar o aplicativo de fiscalização ao poder público (prefeituras ou órgão fiscalizadores) para que possam fazer todo o controle da destinação adequada dos resíduos da construção civil coletados no município, evitando assim, que estes resíduos sejam descartados irregularmente. A PNRS proíbe a destinação em locais impróprios!</Typography>
                </Col>
            </Row>
            <Row className='row-landing-white' gutter={[16,16]} align={'top'} ref={refSolucoes}>
                <Col span={24}>
                    <Typography className='title-1-white'>NOSSAS</Typography>
                    <Typography className='title-2-white'>SOLUÇÕES</Typography>
                </Col>
                <Col md={5} xs={24}>
                    <Image src={image9} preview={false} />
                </Col>
                <Col md={19} xs={24}>
                    <Row gutter={[16,16]}>
                        <Col md={12} xs={24}>
                            <Typography className='title-2-white' style={{marginBottom: -10}}>PARA O CLIENTE FINAL</Typography>
                            <Typography className='title-3-white'>Simplificar o processo de contratação de caçambas, através de um marketplace com prestadores de serviços qualificados. Facilita o acompanhamento do processo de chegada e retirada do entulho com a garantia de uma destinação final adequada.</Typography>
                        </Col>
                        <Col md={12} xs={24}>
                            <Typography className='title-2-white' style={{marginBottom: -10}}>PARA A EMPRESA DE CAÇAMBA</Typography>
                            <Typography className='title-3-white'>Gerenciar o parque de caçambas, de forma on-line, acompanhar todo o processo e maior agilidade no processo de locação de caçambas. Estar na palma da mão de milhares de cliente potenciais, ofertando seus serviços.</Typography>
                        </Col>
                        <Col md={12} xs={24}>
                            <Typography className='title-2-white' style={{marginBottom: -10}}>PARA O PODER PÚBLICO</Typography>
                            <Typography className='title-3-white'>Integrar informações do uso de locais públicos utilizados pelas caçambas, fiscalizando o mau uso ou abuso do espaço e acompanhar a destinação final adequada dos resíduos.</Typography>
                        </Col>
                        <Col md={12} xs={24}>
                            <Typography className='title-2-white' style={{marginBottom: -10}}>PARA O MEIO AMBIENTE</Typography>
                            <Typography className='title-3-white'>Garantir que um determinado entulho teve a destinação final adequada, reaproveitando de melhor forma possível, sem degradar o meio ambiente.</Typography>
                        </Col>
                        <Col md={12} xs={24}>
                            <Typography className='title-2-white' style={{marginBottom: -10}}>PARA OS MOTORISTAS</Typography>
                            <Typography className='title-3-white'>Otimizar as rotas de envio e retirada de caçambas, garantir a destinação final adequada ao entulho.</Typography>
                        </Col>
                        <Col md={12} xs={24}>
                            <Link to="#contato"><Button type='primary' shape='round'>QUERO SER SÓCIO</Button></Link>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row className='row-landing-white' gutter={[16,16]} align={'middle'} style={{paddingRight: 0, paddingTop: 0}}>
                <Col md={12} xs={24}>
                    <Typography className='title-1-white'>NOSSO</Typography>
                    <Typography className='title-2-white'>MODELO DE NEGÓCIO</Typography>
                    <Typography className='title-3-white'>O i9Coleta é um marketplace B2B2C, nosso modelo de receita é baseado em um percentual sobre os valores negociados na plataforma.</Typography>
                    <Typography className='title-3-white'>Modelo já é validado por outras plataformas como AIRBNB, UBER, iFood entre outras, sendo que esta modalidade nunca foi aplicada ou explorada para negócios no mercado de locação de caçambas estacionárias.</Typography>
                    <Typography className='title-3-white'>Como prática de mercado, trabalharemos com uma taxa variável de intermediação de até 20% do valor da locação.</Typography>
                    <Typography className='title-3-white'>Os locadores de caçambas poderão definir o preço na plataforma e o sistema irá calcular e recolher o percentual automaticamente, repassando o valor do locador.</Typography>
                </Col>
                <Col md={12} xs={24}>
                    <Image src={image10} preview={false} />
                </Col>
            </Row>
            <Row className='row-landing-color' gutter={[16,16]} align={'middle'} ref={refFundadores}>
                <Col span={24} style={{marginBottom: 40}}>
                    <center><Typography className='title-1-color'>FUNDADORES E EQUIPE</Typography></center>
                </Col>
                <Col xs={24} md={8}>
                    <center><Image src={image11} preview={false} /></center>
                    <center><Typography className='title-1-color' style={{marginBottom: -10}}>JOSE CARLOS FARIAS</Typography></center>
                    <center><Typography className='title-3-color'>Adminstrador – Idealizador</Typography></center>
                </Col> 
                <Col xs={24} md={8}>
                    <center><Image src={image12} preview={false} /></center>
                    <center><Typography className='title-1-color' style={{marginBottom: -10}}>QUIRINO JUNIOR</Typography></center>
                    <center><Typography className='title-3-color'>Engenheiro Civil – Idealizador</Typography></center>
                </Col> 
                <Col xs={24} md={8}>
                    <center><Image src={image13} preview={false} /></center>
                    <center><Typography className='title-1-color' style={{marginBottom: -10}}>OSTENDER JUNIOR</Typography></center>
                    <center><Typography className='title-3-color'>Analista de Sistemas – Idealizador</Typography></center>
                </Col> 
            </Row>
            <Row className='row-landing-white' gutter={[16,16]} ref={refContato}>

            </Row>
            <Row className='row-landing-white' gutter={[16,16]} ref={refLocador}>

            </Row>
            <Drawer open={menu} onClose={onMenu} width={260} closable={false}>
                <Row>
                    <Col span={24}> <div className='menu-item-side' onClick={() => {toRef(refInicio);onMenu()}}>Início</div> </Col>
                    <Col span={24}> <div className='menu-item-side' onClick={() => {toRef(refSobre);onMenu()}}>Sobre</div> </Col>
                    <Col span={24}> <div className='menu-item-side' onClick={() => {toRef(refMercado);onMenu()}}>Mercado</div> </Col>
                    <Col span={24}> <div className='menu-item-side' onClick={() => {toRef(refSolucoes);onMenu()}}>Soluções</div> </Col>
                    <Col span={24}> <div className='menu-item-side' onClick={() => {toRef(refFundadores);onMenu()}}>Fundadores</div> </Col>
                    <Col span={24}> <div className='menu-item-side' onClick={() => {toRef(refContato);onMenu()}}>Contato</div> </Col>
                    <Col span={24}> <div className='menu-item-side' onClick={() => {toRef(refLocador);onMenu()}}>Cadastro de locadores</div> </Col>
                    <Col span={24} style={{marginTop: 10}}> <Link to='login'><Button block type='primary' shape='round'>ENTRAR</Button></Link> </Col>
                </Row>
            </Drawer>
        </Layout.Content>
    )

}

export default Landing;