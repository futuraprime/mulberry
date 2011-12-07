require 'content_creator'

module Mulberry
  module Command
    class Generate
      def initialize(args = [])
        dir = args[0]

        @dir = Mulberry.paths.get_app_dir dir
        @created_pages = false

        sitemap = YAML.load_file(File.join(@dir, Mulberry::SITEMAP))
        sitemap.each { |page| process_page page }

        if !@created_pages
          puts "All pages in the sitemap already exist"
        end
      end

      private
      def process_page(page)
        if page.is_a? Hash
          page.values.first.each { |child| process_page child }
          create_page page.keys.first
        else
          create_page page
        end
      end

      def create_page(page_name)
        unless page_exists(page_name)
          page = Mulberry::ContentCreator.new(:page, page_name)
          @created_pages = true
        end
      end

      def page_exists(page_name)
        File.exists?(File.join(@dir, 'pages', "#{page_name}.md"))
      end
    end
  end
end
