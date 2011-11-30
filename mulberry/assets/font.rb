require 'mulberry/assets/media_asset'

module Mulberry
  module Asset
    class Font < Mulberry::Asset::MediaAsset
      def asset_type_dir
        'fonts'
      end

      def asset_type
        'font'
      end
    end
  end
end
