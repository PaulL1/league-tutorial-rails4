class TeamsController < ApplicationController
  before_filter :intercept_html_requests
  layout false
  respond_to :json
  before_action :set_team, only: [:show, :edit, :update, :destroy]

  # GET /teams
  # GET /teams.json
  def index
    @teams = Team.all
    render_with_protection @teams
  end

  # GET /teams/1
  # GET /teams/1.json
  def show
    render_with_protection @team
  end

  # POST /teams
  # POST /teams.json
  def create
    @team = Team.new(team_params)

    if @team.save
      render_with_protection @team, { status: :created }
    else
      render_with_protection @team.errors, { status: :unprocessable_entity }
    end
  end

  # PATCH/PUT /teams/1
  # PATCH/PUT /teams/1.json
  def update
    if @team.update(team_params)
      render_with_protection @team
    else
      render_with_protection @team.errors, { status: :unprocessable_entity }
    end
  end

  # DELETE /teams/1
  # DELETE /teams/1.json
  def destroy
    @team.destroy

    head :no_content
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_team
      @team = Team.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def team_params
      params[:team].permit(:club_id, :name, :captain, :date_created)
    end
end