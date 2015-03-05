<?php

namespace printconnect\Templates {

    use printconnect\Dal;

    class Factory {
        protected static $params = array();

        public static function Get($id, $productId = null)
        {
            return new Template(array(
                'id' => $id,
		'productId' => $productId,
            ));
        }

        public static function setparams($params)
        {
            self::$params = $params;
        }

        public static function GetAll()
        {
            $templates = new Templates(array(), array());
            return $templates;
        }
        
        public static function GetAllByProduct($productId)
        {
            $templates = new Templates(array(), array('product' => $productId));
            return $templates;
        }
        
        public static function LoadTemplate(Template $object)
        {
            $id = $object->Get('id');
	    $productId = $object->Get('productId');
            if ($id) {
                Dal::Load($object, 'design-template', array('designTemplateId' => $id, 'productId' => $productId), TRUE);
            };
        }
        
        public static function LoadTemplates($object)
        {
            try {
                if (isset($object->product)) {
                    self::$params['productId'] = $object->product;
                }
                Dal::LoadCollection($object, 'design-template', self::$params, function ($value) {
                    $template = new Template($value);
                    $template->loaded = TRUE;
                    return $template;
                });
            } catch (\Exception $ex) {
                $object->loaded = TRUE;
            }
        }
        
        public static function GetAllFilters()
        {
            $allFilters= new AllFilters(array(), array());
            return $allFilters;
        }
        
        public static function LoadAllFilters($object)
        {
            Dal::Load($object, 'design-template-filter', self::$params);
            return $object;
        }

        public static function getTemplatesCount()
        {
            return Dal::$totalCountTemplates;
        }
        
        public static function getTop10Template() 
        {
            $top10templatesnew = new Templates(array(), array());
            return $top10templatesnew;
        }

        public static function LoadTop10Template($object) 
        {
            Dal::LoadCollection($object, 'design-template-top', array(), function ($value) {
                        $LoadTop10Template = new Template($value);
                        $LoadTop10Template->loaded = TRUE;
                        return $LoadTop10Template;
                    });
            $object->loaded = true;
            return $object;
        }
    }
}
