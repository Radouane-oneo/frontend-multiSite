<?php

namespace printconnect\Offers {

  use printconnect\Dal;
use printconnect\Customers\Customer;
use printconnect\Offers\Offer;
use printconnect\Offers\Offers;
use printconnect\Carts\Cart;

  class Factory {

    /**
     * Get offer by id
     *
     * @param int $hash
     * @return boolean|\printconnect\Offers\Offer
     */
    public static function GetById($hash) {
      try {
        $offer = new Offer(array('hash' => $hash));
        Dal::Load($offer, 'offer', array('hash' => $hash), FALSE);
        return $offer;
      } catch (\Exception $ex) {
        return false;
      }
    }

    /**
     * Reject an offer
     *
     * @param \printconnect\Offers\Offer $offer
     * @return boolean|\printconnect\Offers\Offer
     */
    public static function RejectOffer(Offer $offer) {
      try {
        return Dal::Save($offer, 'offer', array('reject' => $offer->hash));
      } catch (\printconnect\Dal\NotFoundException $exc) {
        return false;
      }
    }

    /**
     * Find all offers for current customer
     *
     * @param \printconnect\Customers\Customer $customer
     * @return boolean|\printconnect\Offers\Offers
     */
    public static function GetAllByCustomer(Customer $customer, $cache=TRUE) {
      try {
        $offers = new Offers();
        Dal::LoadCollection($offers, 'offer', array('customer' => $customer->id), function ($value) {
                  $offer = new Offer($value);
                  $offer->loaded = true;
                  return $offer;
                }, $cache);
        $offers->loaded = true;
        return $offers;
      } catch (\printconnect\Dal\NotFoundException $exc) {
        return false;
      }
    }

    /**
     * Create cart from offer
     *
     * @param \printconnect\Offers\Offer $offer
     * @return boolean|\printconnect\Carts\Cart
     */
    public static function CreateCart(Offer $offer) {
      try {
        $cart = new Cart();
        return Dal::Save($cart, 'offer-to-cart', array('offer' => $offer->hash));
      } catch (\printconnect\Dal\Exception $exc) {
        return false;
      }
    }

    public static function FromCart($cart) {
      $offer = new Offer();
      Dal::Save($offer, 'cart-to-offer', array('cartId' => $cart->id));
      return $offer;
    }

  }

}
