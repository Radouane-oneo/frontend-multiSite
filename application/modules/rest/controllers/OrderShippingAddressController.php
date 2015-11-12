<?php

class Rest_OrderShippingAddressController extends PC_Controller_Rest
{
    /**
     * @var Application_Service_Order
     */
    protected $orderService;

    /**
     * @var Application_Service_Customer
     */
    protected $customerService;

    public function init()
    {
        parent::init();
        $this->orderService = new Application_Service_Order();
        $this->customerService = new Application_Service_Customer();

        $this->functions = array(
            'country' => function ($country) {
                return PC_EntityConverter::toArray($country);
            }
        );
    }

    public function getAction()
    {
        $orderId = $this->_getParam('order');
        $customerId = $this->_getParam('customer');

        if ($customerId !== null && $orderId !== null) {
            if (!$this->customerService->exists($customerId, $this->resellerShopId)) {
                $this->restError('Given customer does not exist!', self::BAD_REQUEST);
            }

            if (!$this->orderService->exists($orderId, $this->resellerShopId)) {
                $this->restError('Given order does not exist!', self::BAD_REQUEST);
            }

            $orderShippingAddress = $this->orderService->findOrderShippingAddressByOrder($orderId);

            $this->view->assign(PC_EntityConverter::toArray($orderShippingAddress, $this->functions));
        } else {
            $this->restError('Given keys not supported!', self::BAD_REQUEST);
        }
    }

    public function indexAction()
    {
        $this->restError('Forbidden!');
    }

    public function postAction()
    {
        try {
	        if (isset($this->formData['cart']) && isset($this->formData['orderShipping'])) {
                $orderService = new Application_Service_Order();
                $cart = $orderService->find($this->formData['cart']);
                $orderService->updateShippingAddress($cart, $this->formData['orderShipping']);
            }
        } catch (Zend_Exception $exc) {
            return;
        }
    }

    public function putAction()
    {
        $deliverytype = $this->formData['deliverytype'];  

        $orderShippingAddressModel = new Application_Service_OrderShippingAddress();

        $cart = $this->orderService->find($this->formData['cartId']);

        if($deliverytype == 'deliveryTypePickup') {
            $id = $this->formData['id'];
            $name = $this->formData['name'];  

            $orderShippingAddress = $orderShippingAddressModel->findById($id);

            if(!$orderShippingAddress) {
                $this->restError('Order shipping address not found!');
            }else {
                if($orderShippingAddress->getPickupPointId()){
                    $orderShippingAddress->setName($name);

                    $this->orderService->getEntityManager()->flush();
                }
            }
        }else {
            $data = $this->formData;
            $data['customerAddresses'] = $data['id'];
            $data['order'] = $cart;
            $data['customer'] = $cart->getCustomer()->getId();

            $orderShippingAddress = $this->orderService->findOrderShippingAddressByOrder($data['cartId']);
            if(!$orderShippingAddress) {
                $customerAddressModel = new Application_Model_CustomerAddress();
                $customerAddress = $customerAddressModel->findById($data['id']);
                $data = array_merge($data, PC_EntityConverter::toArray($customerAddress));
                $data['email'] = $cart->getCustomer()->getEmail();
                $data['pickupPointId'] =  NULL;
                $data['pickupPointName'] =  NULL;
            }

            $orderShippingAddress = $orderShippingAddressModel->saveData($data, $orderShippingAddress);

            $this->orderService->getEntityManager()->persist($orderShippingAddress);
            $this->orderService->getEntityManager()->flush();
        }

        $data = array();

        $data['orderItemShipping'] = PC_EntityConverter::toArray($cart->getOrderItemShipping(), array(
            'deliveryType' => function($orderItemShipping)
            {
                $shippingType = $orderItemShipping->getShippingTypeResellerShop()->getShippingType();
                return $shippingType->getDeliveryType();
            },
            'shippingTypeTag' => function($orderItemShipping)
            {
                $shippingType = $orderItemShipping->getShippingTypeResellerShop()->getShippingType();
                return $shippingType->getTag();
            }
        ));

        $shippingType         = $cart->getOrderItemShipping()->getShippingTypeResellerShop()->getShippingType();
        $orderShippingAddress = $this->orderService->findOrderShippingAddressByOrder($cart->getId());

        if ($orderShippingAddress !== null) {
            $data['orderItemShipping']['orderShippingAddress'] = PC_EntityConverter::toArray($orderShippingAddress, array(
                'country' => function($country)
                {
                    return PC_Translate_MySQL::translateRest($country->getTag()); 
                },
                'openingHours' => function($orderShippingAddress) use ($shippingType)
                {
                    if ($orderShippingAddress->getPickupPointId()) {
                        if (in_array($shippingType->getTag(), array(
                            'shippingTypeStore',
                            'shippingTypePrinter',
                            'shippingTypeStoreInAntwerpen',
                            'shippingTypeCoyotePrinter'
                        ))) {
                            $storeService = new \Application_Service_Store();
                            $store        = $storeService->findPickupPoint($orderShippingAddress->getPickupPointId());
                            
                            if (!$store)
                                return null;
                            
                            $openingHoursService = new \Application_Service_StoreOpeningHour();
                            return $openingHoursService->convertOpeningHoursToArray($store->getOpeningHours());
                        } elseif (in_array($shippingType->getTag(), array(
                            'shippingTypeBpostPickupPoint'
                        ))) {
                            $service = PC_Shipping_ShippingFactory::create($shippingType->getTag());
                            
                            $pickuppoint = $service->getPickupPointDetails($orderShippingAddress->getPickupPointId(), $orderShippingAddress->getCountry()->getIso());
                            
                            if (!$pickuppoint)
                                return null;
                            
                            $openingHours = array();
                            $i            = 1;
                            foreach ((array) $pickuppoint->getOpeningHours() as $value) {
                                $openingHours[$i] = explode('- -', $value);
                                $i++;
                            }
                            
                            return $openingHours;
                        }
                    }
                },
                'geographical' => function($orderShippingAddress) use ($shippingType)
                {
                    if ($orderShippingAddress->getPickupPointId() && in_array($shippingType->getTag(), array(
                        'shippingTypeStore',
                        'shippingTypePrinter',
                        'shippingTypeStoreInAntwerpen',
                        'shippingTypeCoyotePrinter'
                    ))) {
                        $resellerAddressService = new \Application_Service_ResellerAddress();
                        
                        $resellerAddress = $resellerAddressService->findByReseller($orderShippingAddress->getPickupPointId());
                        
                        if (isset($resellerAddress[0]) && $resellerAddress[0]) {
                            return array(
                                'longitude' => $resellerAddress[0]->getLatitude(),
                                'latitude' => $resellerAddress[0]->getLongitude()
                            );
                        }
                    }
                }
            ));


            if($orderShippingAddress->getShippingAddress()) {
                $data['customerAddress'] = PC_EntityConverter::toArray($orderShippingAddress->getShippingAddress());
            }

        }

        $this->view->assign($data);
    }

    public function deleteAction()
    {
        $this->restError('Forbidden!');
    }
}
