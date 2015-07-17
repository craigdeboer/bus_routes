FactoryGirl.define do
  factory :student do
    school_list = ["Surrey School1", "Surrey School2", "Langley School 1", "Langley School2"]
    random_grade = Random.new
    first_name {Faker::Name.first_name}
    last_name {Faker::Name.last_name}
    school school_list.sample
    grade random_grade.rand(1..12)
    phone {Faker::PhoneNumber.phone_number}
    email {Faker::Internet.email}
    street_address {Faker::Address.street_address}
    city {Faker::Address.city}
    postal_code "V3R 0A2"
    bus_route 101
  end
end
