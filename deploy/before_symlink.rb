rails_env = new_resource.environment["RAILS_ENV"]
shared_path = "#{new_resource.deploy_to}/shared"

directory "#{shared_path}/assets" do
  mode 0770
  action :create
  recursive true
end

link "#{release_path}/public/assets" do
  to "#{shared_path}/assets"
end

execute "rake assets:precompile" do
  cwd release_path
  command "bundle exec rake assets:precompile"
  environment 'RAILS_ENV' => rails_env
end
