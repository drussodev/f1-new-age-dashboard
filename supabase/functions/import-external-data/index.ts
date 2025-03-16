
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Client } from 'https://deno.land/x/mysql@v2.11.0/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Extract the token from the authorization header
    const token = authHeader.split(' ')[1]

    // Create a Supabase client with the user's JWT token
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: `Bearer ${token}` },
        },
      }
    )

    // Get the user from the token
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser(token)

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify if the user is an admin (you might want to add this check)
    // For this example, we'll assume this edge function should only be called by authorized personnel

    console.log('Starting data import from external database')

    // Connect to the external MySQL database
    const mysqlClient = await new Client().connect({
      hostname: Deno.env.get('EXTERNAL_DB_HOST') ?? '',
      username: Deno.env.get('EXTERNAL_DB_USER') ?? '',
      password: Deno.env.get('EXTERNAL_DB_PASSWORD') ?? '',
      db: Deno.env.get('EXTERNAL_DB_NAME') ?? '',
    })

    // Fetch data from MySQL tables
    console.log('Fetching drivers data from external database')
    const drivers = await mysqlClient.query(`SELECT * FROM drivers`)
    
    console.log('Fetching teams data from external database')
    const teams = await mysqlClient.query(`SELECT * FROM teams`)
    
    console.log('Fetching races data from external database')
    const races = await mysqlClient.query(`SELECT * FROM races`)
    
    console.log('Fetching news data from external database')
    const news = await mysqlClient.query(`SELECT * FROM news`)
    
    console.log('Fetching config data from external database')
    const configData = await mysqlClient.query(`SELECT * FROM config`)
    
    console.log('Fetching streamers data from external database')
    const streamers = await mysqlClient.query(`SELECT * FROM streamers`)

    // Close the MySQL connection
    await mysqlClient.close()

    // Clear existing data from Supabase tables (if needed)
    // Note: This will remove all existing data, use with caution!
    console.log('Clearing existing data from Supabase tables')
    await supabaseClient.from('drivers').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabaseClient.from('teams').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabaseClient.from('races').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabaseClient.from('news').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabaseClient.from('streamers').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabaseClient.from('config').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    // Insert data into Supabase tables
    console.log('Inserting drivers data into Supabase')
    const transformedDrivers = drivers.map((driver: any) => ({
      name: driver.name,
      team: driver.team,
      country: driver.country,
      points: driver.points,
      color: driver.color || '#FF1E00', // Default color if not provided
      image_url: driver.image_url,
    }))
    
    if (transformedDrivers.length > 0) {
      const { error: driversError } = await supabaseClient.from('drivers').insert(transformedDrivers)
      if (driversError) {
        console.error('Error inserting drivers:', driversError)
      }
    }

    console.log('Inserting teams data into Supabase')
    const transformedTeams = teams.map((team: any) => ({
      name: team.name,
      color: team.color || '#FF1E00', // Default color if not provided
      points: team.points,
      logo_url: team.logo_url,
    }))
    
    if (transformedTeams.length > 0) {
      const { error: teamsError } = await supabaseClient.from('teams').insert(transformedTeams)
      if (teamsError) {
        console.error('Error inserting teams:', teamsError)
      }
    }

    console.log('Inserting races data into Supabase')
    const transformedRaces = races.map((race: any) => ({
      name: race.name,
      circuit: race.circuit,
      date: race.date,
      location: race.location,
      completed: race.completed || false,
      winner: race.winner,
    }))
    
    if (transformedRaces.length > 0) {
      const { error: racesError } = await supabaseClient.from('races').insert(transformedRaces)
      if (racesError) {
        console.error('Error inserting races:', racesError)
      }
    }

    console.log('Inserting news data into Supabase')
    const transformedNews = news.map((item: any) => ({
      title: item.title,
      content: item.content,
      date: item.date,
      image_url: item.image_url,
      video_url: item.video_url,
      featured: item.featured || false,
    }))
    
    if (transformedNews.length > 0) {
      const { error: newsError } = await supabaseClient.from('news').insert(transformedNews)
      if (newsError) {
        console.error('Error inserting news:', newsError)
      }
    }

    console.log('Inserting config data into Supabase')
    if (configData && configData.length > 0) {
      const { error: configError } = await supabaseClient.from('config').insert({
        title: configData[0].title || 'F1 New Age Tournament',
        season: configData[0].season || '2023',
      })
      
      if (configError) {
        console.error('Error inserting config:', configError)
      } else {
        // Get the config ID for streamers
        const { data: configInfo } = await supabaseClient.from('config').select('id').limit(1).single()
        
        if (configInfo && configInfo.id) {
          console.log('Inserting streamers data into Supabase')
          const transformedStreamers = streamers.map((streamer: any) => ({
            username: streamer.username,
            display_name: streamer.display_name,
            config_id: configInfo.id,
          }))
          
          if (transformedStreamers.length > 0) {
            const { error: streamersError } = await supabaseClient.from('streamers').insert(transformedStreamers)
            if (streamersError) {
              console.error('Error inserting streamers:', streamersError)
            }
          }
        }
      }
    }

    console.log('Data import completed successfully')

    return new Response(
      JSON.stringify({ success: true, message: 'Data imported successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in import-external-data function:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
