import { Result, Icon, Button, Divider, List, Avatar, Carousel } from 'antd';
import { Fragment } from 'react';
import { withRouter } from 'next/router';
import { useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import Router from 'next/router';
import '../static/css/carousel.css';

const data = [
  {
    title: 'File Rekomendasi',
    description: 'File ini digunakan untuk diisi oleh perekomendasi kamu',
    urlFile: 'https://res.cloudinary.com/fim-indonesia/raw/upload/v1563327650/document/Surat_Rekomendasi_FIM_21_non_next_gen.docx'
  },
  {
    title: 'File Surat Pernyataan Komitmen Diri',
    description: 'File ini sebagai bukti komitmen kamu',
    urlFile: 'https://res.cloudinary.com/fim-indonesia/raw/upload/v1563242868/document/SURAT_PERNYATAAN_KOMITMEN_DIRI.docx'
  }
];

function Index(props) {
  const { cookieLogin } = props

  useEffect(() => {
    props.router.prefetch('/login')
    props.router.prefetch('/fim21')
  }, [])

  let decode = {}

  try {
    decode = jwtDecode(cookieLogin)
  } catch (error) {
  }

  const _onClickHandler = () => {
    window && window.ga && window.ga('send', {
      hitType: 'event',
      eventCategory: 'Pendaftaran FIM',
      eventAction: 'clickButton',
      eventLabel: 'Daftar FIM'
    })
    Router.push('/fim21')
  }

  let extraButton = [
    <Button key={1} onClick={() => { _onClickHandler() }} type="primary">Daftar FIM 21</Button>
  ]

  return (
    <div>
      <Carousel autoplay effect="fade">
        <div>
          <img style={{ maxHeight: '100%', maxWidth: '100%' }} alt="all-fim" src="https://res.cloudinary.com/fim-indonesia/image/upload/q_auto:low/v1563261128/banner_primary.jpg" />
        </div>
      </Carousel>
      <Result
        icon={<Icon type="smile" theme="twoTone" />}
        title="Halo Pemuda Pemudi Indonesia!"
        subTitle={`Hi ${decode.email || ''} Mari Bergabung ke Keluarga Besar Forum Indonesia Muda`}
        extra={extraButton}
      />
      <Divider>File Format Berkas</Divider>
      <p>
        Berikut ini list file berformat yang dibutuhkan untuk diupload di tahap pendaftaran
      </p>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar icon="file-word" />}
              title={<a href={item.urlFile}>{item.title}</a>}
              description={item.description}
            />
          </List.Item>
        )}
      />
    </div>
  )
}

export default withRouter(Index);