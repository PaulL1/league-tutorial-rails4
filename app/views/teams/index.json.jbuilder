json.array!(@teams) do |team|
  json.extract! team, :club_id, :name, :captain, :date_created
  json.url team_url(team, format: :json)
end
