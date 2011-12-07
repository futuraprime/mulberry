require "lib/builder/task_base"

module Builder
  class Project < Builder::TaskBase
    attr_reader :location, :target

    def build
      raise "Unknown device type" unless !([ 'phone', 'tablet' ].index(@target['device_type']).nil?)
      raise "Unknown device os" unless !([ 'android', 'ios' ].index(@target['device_os']).nil?)

      @template_dir = File.join(Builder::Build.root, 'builder', 'project_templates')

      if @target['build_type'] == 'browser'
        subdir = [ 'web', @target['device_type'] ].join('-')
        dest = File.join(@location, subdir)
        FileUtils.rm_rf dest if File.exists? dest
        FileUtils.mkdir_p File.join(dest, 'www')

        Builder::Project::Browser.new(self, @build).build
        @dir = subdir
        return true
      end

      case @target['device_os']
      when 'android'
        if @target['device_type'] == 'phone'
          FileUtils.cp_r(
            File.join(@template_dir, 'android'),
            @location
          )
          Builder::Project::Android.new(self, @build).build
          @dir = 'android'
        else
          raise "We only know how to build an android project for phone."
        end

      when 'ios'
        # TODO: this logic could suck less and could be DRY'd too
        if @target['device_type'] == 'phone'
          FileUtils.cp_r(
            File.join(@template_dir, 'iOS'),
            File.join(@location, 'iphone')
          )

          Builder::Project::IOS.new(self, @build).build
          @dir = 'iphone'
        elsif @target['device_type'] == 'tablet'
          FileUtils.cp_r(
            File.join(@template_dir, 'iOS'),
            File.join(@location, 'ipad')
          )

          Builder::Project::IOS.new(self, @build).build
          @dir = 'ipad'
        else
          raise "We only know how to build an ios project for phone and tablet."
        end
      end

      true
    end

    def report
      {
        :location => @location,
        :dir => @dir
      }
    end

    private
    def self.sed
      is_mac = RUBY_PLATFORM =~ /darwin/
      is_mac ? %{sed -i '' } : %{sed -i""}
    end

    def template_dir
      @template_dir
    end

    class Browser
      def initialize(task, build)
        @task = task
        @build = build
        @target = task.target
      end

      def build
        # noop for now
      end
    end

    class Android
      def initialize(task, build)
        @task = task
        @build = build
        @target = task.target
      end

      def build
        sed = Builder::Project.sed
        dev = @task.target['development']
        project_settings = @build.build_helper.project_settings

        app_id = @build.build_helper.app_id(
          @target['device_os'],
          @target['device_type']
        )

        android_dir = File.join(@task.location, 'android')
        new_java_dir = File.join(android_dir, 'src', app_id.split('.'))
        keystore = File.join(project_settings[:config_dir], 'android', 'keystore')
        proj_files = Dir.glob(File.join(android_dir, 'src', 'com', 'toura', 'www', '*'))

        FileUtils.mkdir_p(new_java_dir)
        FileUtils.mv(proj_files, new_java_dir)

        if !dev
          if File.exists? keystore
            FileUtils.cp(keystore, android_dir)
          else
            @build.log(%Q{
No keystore was found at #{keystore}.
You will need to add a keystore to your Android project directory manually;
see http://developer.android.com/guide/publishing/app-signing.html for instructions.
            }, 'warning')
          end
        end

        java_src_files = Dir.glob(File.join(new_java_dir, '**', '*.java'))
        safe_name = project_settings[:name].split(%r{[^\w]+}).join

        manifest_file = File.join(android_dir, 'AndroidManifest.xml')
        build_file = File.join(android_dir, 'build.xml')

        # android manifest
        system %{#{sed} -e 's/{android.versionCode}/#{project_settings[:version]}/' \
          -e 's/{android.versionName}/#{project_settings[:published_version]}/' \
          -e 's/com.toura.www/#{app_id}/' \
          #{manifest_file}
        }

        # use the proper id in all java files
        java_src_files.each do |java_file|
          system %{#{sed} -e 's/com.toura.www/#{app_id}/' #{java_file} }
        end

        # use a "safe" version of the tour name in build.xml
        system %{#{sed} -e 's/name=\"www\"/name=\"#{safe_name}\"/' \ #{build_file}}

        # TODO: figure this out (???)
        safe_display_name = Builder.escape_quotes_for_system_call(project_settings[:name])

        # Set the display name
        system %{#{sed} -e 's/www/#{safe_display_name}/' \
          #{File.join(android_dir, 'res', 'values', 'strings.xml')}
        }

        assets_dir = File.join(android_dir, 'assets')

        touraconfig_file = File.join(assets_dir, 'touraconfig.properties')
        if project_settings[:flurry_config]
          flurry_api_key = project_settings[:flurry_config]['android']['api_key']
        else
          flurry_api_key = 'NO_FLURRY_KEY_AVAILABLE' # must be non-blank value
        end
        %x{#{sed} -e 's/${flurryApiKey}/#{flurry_api_key}/' #{touraconfig_file}}

        ua_config = project_settings[:urban_airship_config]
        if ua_config
          airshipconfig_file = File.join(assets_dir, "airshipconfig.properties")
          if dev
            debug = true
            in_production = false
            credential_key_prefix = 'development'
            credentials = ua_config['development']
          else
            debug = false
            in_production = true
            credential_key_prefix = 'production'
            credentials = ua_config['production']
          end
          %x{#{sed} -e 's/${#{credential_key_prefix}AppKey}/#{credentials['app_key']}/' \
            -e 's/${#{credential_key_prefix}AppSecret}/#{credentials['app_secret']}/' \
            -e 's/${debug}/#{debug}/' -e 's/${inProduction}/#{in_production}/' \
            -e 's/${transport}/#{ua_config['android']['transport']}/' \
            -e 's/${c2dmSender}/#{ua_config['android']['c2dm_sender']}/' \
            #{airshipconfig_file}
          }
        end

        www = File.join(android_dir, 'assets', 'www')
        FileUtils.mkdir_p www unless File.exists? www
        FileUtils.mv(File.join(android_dir, 'phonegap.js'), www)

        adb = %x{which adb}.chomp

        if File.exists? adb
          adb_dir = File.dirname adb
          dest = File.join(android_dir, 'local.properties')

          FileUtils.rm_rf(dest) if File.exists?(dest)

          if adb_dir.match('platform-tools')
            adb_dir = File.dirname adb_dir
          end

          File.open(File.join(android_dir, 'local.properties'), 'w') do |f|
            f.write "sdk.dir=#{adb_dir}"
          end
        else
          adb_dir = '/Developer/SDKs/android-sdk-mac_x86/'
          @build.log(
            "Using default location of #{adb_dir} for Android SDK",
            'warning'
          )
        end
      end
    end

    class IOS
      def initialize(task, build)
        @task = task
        @build = build
        @target = @task.target
        @itype = {
          :phone => 'iphone',
          :tablet => 'ipad'
        }[@target['device_type'].to_sym]
      end

      def build
        dev = @task.target['development']
        sed = Builder::Project.sed
        app_id = @build.build_helper.app_id(
          @target['device_os'],
          @target['device_type']
        )

        project_settings = @build.build_helper.project_settings

        project_toura_dir = File.join(@task.location, @itype, "Toura")

        FileUtils.cp(
          File.join(project_toura_dir, "Toura-Info.#{@itype}.plist"),
          File.join(project_toura_dir, "Toura-Info.plist")
        )

        plist_file = File.join(project_toura_dir, 'Toura-Info.plist')
        if project_settings[:flurry_config]
          flurry_api_key = project_settings[:flurry_config]['ios']['api_key']
        else
          flurry_api_key = 'NO_FLURRY_KEY_AVAILABLE' # must be non-blank value
        end
        product_name = project_settings[:name] || "The App With No Name"
        plist_result = %x{#{sed} -e 's/${PRODUCT_NAME}/#{product_name}/' \
          -e 's/com.toura.app2/#{app_id}/' \
          -e 's/${BUNDLE_VERSION}/#{project_settings[:published_version]}/' \
          -e 's/${FlurryApiKey}/#{flurry_api_key}/' \
          #{plist_file}
        }

        ua_config = project_settings[:urban_airship_config]
        if ua_config
          credentials = dev ? ua_config['development'] : ua_config['production']
          plist_file = File.join(project_toura_dir, 'UrbanAirship.plist')
          plist_result = %x{#{sed} -e 's/${UrbanAirshipKey}/#{credentials['app_key']}/' \
            -e 's/${UrbanAirshipSecret}/#{credentials['app_secret']}/' \
            #{plist_file}
          }
        end

      end
    end
  end
end
