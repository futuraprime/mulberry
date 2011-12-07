module Mulberry
  class TemplateCreator
    def initialize(code_type, filename)
      template_dir = Mulberry::PathHelper.get_dir('templates')
      FileUtils.mkdir_p template_dir unless File.exists? template_dir
      template_filename = File.join(template_dir, "#{filename}.yml")

      if File.exists? template_filename
        raise "Component #{template_filename} already exists"
      end

      template_template = File.read(File.join(Mulberry::Directories.templates, 'template.yml'))

      File.open(template_filename, 'w') do |f|
        f.write template_template.gsub('{{template_name}}', filename)
      end

      puts "Created template at #{template_filename}"
    end
  end
end
