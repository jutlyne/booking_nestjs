@startuml

note as N1
  all tables has these 
  - created_at: datetime
  - updated_at: datetime
  - deleted_at: detetime
end note

entity users  {
  + id (PK)
  --
  name: varchar(), not null
  email: varchar(), not null
  password: varchar(), not null
  fullname: varchar()
  phone: int()
  avatar: varchar()
  team_id: int()
  password_reset_pin: int()
  password_reset_sent_at: datetime()
}

entity teams {
  + id (PK)
  --
  name: varchar(), not null
  avatar: varchar()
  user_id: int() -- for leader
}

teams ||--o{ users : members
users ||--o{ teams : leader

entity locations {
  + id (PK)
  --
  name: varchar(), not null
  address: varchar()
}

entity rooms {
  + id (PK)
  --
  name: varchar(), not null
  location_id: int(), not null
}
 
locations ||--o{ rooms : has
  
entity room_bookings {
  + id (PK)
  --
  room_id: int(), not null
  user_id: int(), not null
  team_id: int()
  start_time: datetime(), not null
  end_time: datetime(), not null
  is_recurring: boolean(), default false
  recurring_rule_id: int()
}

entity recurring_rules {
  + id (PK)
  --
  frequency: enum('daily', 'weekly', 'monthly')
  interval: int(), default 1
  weekdays: varchar()
  day_of_month: int()
  repeat_until: datetime()
}

entity room_booking_occurrences {
  +id (PK)
  --
  booking_id: int()
  occurrence_date: date()
  start_time: time()
  end_time: time()
}
  
rooms ||--o{ room_bookings
room_bookings ||--o{ room_booking_occurrences
recurring_rules ||--o{ room_bookings

@enduml