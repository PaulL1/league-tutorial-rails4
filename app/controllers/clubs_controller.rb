class ClubsController < ApplicationController
  before_filter :intercept_html_requests
  layout false
  respond_to :json
  before_action :set_club, only: [:show, :edit, :update, :destroy]

  # GET /clubs
  # GET /clubs.json
  def index
    @clubs = Club.all
    render_with_protection @clubs
  end

  # GET /clubs/1
  # GET /clubs/1.json
  def show
    render_with_protection @club
  end

  # POST /clubs
  # POST /clubs.json
  def create
    @club = Club.new(club_params)

    if @club.save
      render_with_protection @club, { status: :created }
    else
      render_with_protection @club.errors, { status: :unprocessable_entity }
    end
  end

  # PATCH/PUT /clubs/1
  # PATCH/PUT /clubs/1.json
  def update
    if @club.update(club_params)
      render_with_protection @club
    else
      render_with_protection @club.errors, { status: :unprocessable_entity }
    end
  end

  # DELETE /clubs/1
  # DELETE /clubs/1.json
  def destroy
    @club.destroy

    head :no_content
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_club
      @club = Club.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def club_params
      params.require(:club).permit(:name, :contact_officer, :date_created)
    end
end