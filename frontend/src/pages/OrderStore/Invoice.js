import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getOrder } from '../../services/order.service'
import { totalBeforeTax, totalAfterTax } from './helper'
import './OrderStore.css'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { toast } from 'react-toastify'

const Invoice = () => {
  const [order, setOrder] = useState({})
  const pdfRef = useRef()

  const params = useParams()
  const { sessionId } = params

  const navigate = useNavigate()

  const handleDownloadInvoice = async (event) => {
    event.preventDefault()
    const input = pdfRef.current
    const canvas = await html2canvas(input)
    const imgData = canvas.toDataURL('img/png')
    const pdf = new jsPDF('p', 'mm', 'a4', true)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
    const imgX = (pdfWidth - imgWidth * ratio) / 2
    const imgY = 30
    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
    pdf.save('invoice.pdf')
  }

  useEffect(() => {
    getOrder(`/api/order-details/${sessionId}`).then((res) => {
      if (res && res?.data.order) {
        console.log(res?.data.order)
        setOrder(res.data.order)
      }
    }).catch(async (err) => {
      console.log(err)
      const { error } = err.response.data
      if (error && (error === 'token not found on request' || error === 'refresh token expired')) {
        console.log(error)
        toast.info('Session expired, login to continue', { autoClose: false })
        navigate('/login')
      }
    })
  }, [navigate, sessionId])

  return (
    <div className='container-lg mx-auto' ref={pdfRef}>
      <div className='container mx-auto mb-3 border-bottom'>
        <div className='row mb-3'>
          <div className='col-lg-3' />
          <div className='col-lg-6'>
            <p className='display-5 text-justify'>Order final Details</p>
          </div>
          <div className='col-lg-3' />
        </div>
        <div className='row mx-auto'>
          <div className='col-lg-6'>
            <div className='row mb-2'>
              <div className='col-lg-6'>
                <span className='text-justify'>Order Placed</span>
              </div>
              <div className='col-lg-6'>
                <span className='text-justify'>{order.orderplaced}</span>
              </div>
            </div>
            <div className='row mb-2'>
              <div className='col-lg-6'>
                <span className='text-justify'>Order Number</span>
              </div>
              <div className='col-lg-6'>
                <span className='text-justify'>{order.orderNumber}</span>
              </div>
            </div>
            <div className='row'>
              <div className='col-lg-6'>
                <span className='text-justify'>Order total</span>
              </div>
              <div className='col-lg-6'>
                <span className='text-justify'>${order.orderTotal}</span>
              </div>
            </div>
          </div>
          <div className='col-lg-6'>
            <div className='row'>
              <div className='col-lg-4' />
              <div className='col-lg-8 text-end'>
                <button className='btn btn-white py-1 px-5 border' onClick={(e) => handleDownloadInvoice(e)}><small>Download</small></button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='container mx-auto p-2 mb-3 border-bottom'>
        {order.cartItems?.map((item, i) => {
          return (
            <React.Fragment key={i}>
              <div className='row mx-auto p-2'>
                <div className='col-lg-6'>
                  <div className='row'>
                    <div className='col-lg-6'>
                      <span className='text-justify'>Name</span>
                    </div>
                    <div className='col-lg-6'>
                      <span className='text-justify'>{item.prodName}</span>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-lg-6'>
                      <span className='text-justify'>Description</span>
                    </div>
                    <div className='col-lg-6'>
                      <span className='text-justify'>{item.des}</span>
                    </div>
                  </div>
                  <div className='row mb-3'>
                    <div className='col-lg-6'>
                      <span className='text-justify'>Quantity</span>
                    </div>
                    <div className='col-lg-6'>
                      <span className='text-justify'>{item.quantity} item(s)</span>
                    </div>
                  </div>
                </div>
                <div className='col-lg-3'>
                  <span>Unit price</span>
                  <p>${item.newPrice}</p>
                </div>
                <div className='col-lg-3'>
                  <span>Amount</span>
                  <p>${(item.newPrice * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            </React.Fragment>
          )
        })}
      </div>
      <div className='container mx-auto p-2 mb-3'>
        <div className='row mx-auto mb-3'>
          <div className='col-lg-3' />
          <div className='col-lg-6 text-center'>
            <h5 className='text-justify fw-semibold'>Payment Infomation</h5>
          </div>
          <div className='col-lg-3' />
        </div>

        <div className='row mx-auto border-bottom'>
          <div className='col-lg-6'>
            <span>Payment method</span>
            <p className='m-0'>Visa ending in {order.last4}</p>
            <div className='mt-2'>
              <span>Billing Address</span>
              <div className=''>
                <p className='m-0 text-justify'>{order.customerAddress?.name}</p>
                <p className='m-0 text-justify'>{order.customerAddress?.line1}, {order.customerAddress?.line2}</p>
                <p className='m-0 text-justify'>{order.customerAddress?.city}, {order.customerAddress?.state} {order.customerAddress?.postalcode}</p>
              </div>
            </div>
            <div className='mt-4'>
              <span>Credit Card transactions</span>
            </div>

          </div>
          <div className='col-lg-6'>
            <div className='row border-bottom'>
              <div className='col-lg-6'>
                <span className='text-justify fw-semibold'>Subtotal</span>
              </div>
              <div className='col-lg-6 text-end'>
                <span className='text-justify'>${order.orderTotal}</span>
              </div>
            </div>
            <div className='row border-bottom'>
              <div className='col-lg-6'>
                <span>Shipping</span>
              </div>
              <div className='col-lg-6 text-end'>
                <span>${order.shipping}.00</span>
              </div>
            </div>
            <div className='row border-bottom'>
              <div className='col-lg-6'>
                <span>Total before tax</span>
              </div>
              <div className='col-lg-6 text-end'>
                <span>${totalBeforeTax(order.orderTotal, order.shipping)}</span>
              </div>
            </div>
            <div className='row border-bottom'>
              <div className='col-lg-6'>
                <span>Estimated tax</span>
              </div>
              <div className='col-lg-6 text-end'>
                <span>${order.tax}.00</span>
              </div>
            </div>
            <div className='row border-bottom'>
              <div className='col-lg-6'>
                <span className='fw-semibold text-justify'>Grand total</span>
              </div>
              <div className='col-lg-6 text-end'>
                <span className='text-justify'>${totalAfterTax(order.orderTotal, order.shipping, order.tax)}</span>
              </div>
            </div>
            <div className='row mt-5'>
              <div className='col-lg-6'>
                <p className='m-0'>Visa ending in {order.last4}</p>
                <span>{order.orderplaced}</span>
              </div>
              <div className='col-lg-6 text-end'>
                <span className='text-justify'>${totalAfterTax(order.orderTotal, order.shipping, order.tax)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Invoice
