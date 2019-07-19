import React, { Fragment, useState, useEffect } from 'react';
import { BackTop, Divider, Skeleton, Empty, message, List, Card, Button } from 'antd';
import { fetch } from '@helper/fetch';
import { sendPageview } from '@tracker';

function isEmptyObject(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

function Content({loading, tunnels, setTunnel, tunnel}) {

  const fallbackImage = "https://res.cloudinary.com/fim-indonesia/image/upload/v1563240716/fallback-jalur.jpg"

  if (loading) {
    return <Skeleton active />
  } else if (!tunnels || tunnels.length === 0) {
    return <Empty />
  } else {
    return <List
      grid={{
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 4,
        lg: 4,
        xl: 6,
        xxl: 3,
      }}
      dataSource={tunnels}
      renderItem={(item) => {
        const styleObj = {
          ...item.id === tunnel.id && {
            borderColor: 'red'
          }
        }

        return <List.Item>
          <Card style={styleObj} cover={<img alt="example" src={item.urlPicture || fallbackImage} />} hoverable onClick={() => {
            message.info(`Kamu memilih jalur ${item.name}`)
            setTunnel(item)
          }} title={item.name}>{item.description || 'Wait Input'}</Card>
        </List.Item>
      }}
    />
  }
}

function ChooseTunnel({ refetchStep, cookieLogin, dataUser }) {
  const [loading, setLoading] = useState(false)
  const [loadingButton, setLoadingButton] = useState(false)
  const [tunnels, setTunnels] = useState([])
  const [tunnel, setTunnel] = useState({})

  useEffect(() => {
    sendPageview({ pathName: '/chooseTunnel' })
  }, [])

  useEffect(() => {
    const fetchTunnel = async () => {
      setLoading(true)
      try {
        const response = await fetch({
          url: '/tunnel/list',
          method: 'get',
          headers: {
            'Authorization': `Bearer ${cookieLogin}`
          },
        })
  
        const status = (response.data.status || false)

        if (!status) {
          message.error("Server Error")
          setTunnels(null)
          setLoading(false)
        } else {
          const responseData = response.data.data || []
          setTunnels(responseData)
          setLoading(false)

          if (dataUser.tunnelId) {
            const findData = responseData.find(item => item.id === dataUser.tunnelId)
            findData && setTunnel(findData)
          }

        }

      } catch (error) {
        message.error("Server Error")
        setTunnels(null)
        setLoading(false)
      }
    }

    fetchTunnel();
  }, [dataUser])

  const submitEvent = async () => {
    if (isEmptyObject(tunnel)) {
      message.error("Pilih Jalur dahulu!")
    } else {
      setLoadingButton(true)

      try {
        const response = await fetch({
          url: '/auth/save-tunnel',
          method: 'post',
          headers: {
            'Authorization': `Bearer ${cookieLogin}`
          },
          data: {
            tunnelId: tunnel.id
          }
        })
  
        const status = (response.data.status || false)

        if (!status) {
          message.error("Server Error")
          setLoadingButton(false)
        } else {
          message.success("Sukses")
          refetchStep();
          setLoadingButton(false)
        }
      } catch (error) {
        setLoadingButton(false)
      }
      
      // setTimeout(() => {
      //   setLoadingButton(false)
      // }, 3000)
    }
  }

  const buttonSubmitProps = () => {
    return {
      loading: loadingButton,
      onClick: submitEvent,
      type: 'primary',
      size: 'large'
    }
  }

  return (<Fragment>
    <Button {...buttonSubmitProps()} >
      Submit
    </Button>
    {!isEmptyObject(tunnel) && <Divider>Pilihan mu: {tunnel.name}</Divider>}
    <Divider>Tentukan Pilihan mu</Divider>
    <Content tunnel={tunnel} setTunnel={setTunnel} loading={loading} tunnels={tunnels}  />
    <BackTop />
  </Fragment>)
}

export default ChooseTunnel;