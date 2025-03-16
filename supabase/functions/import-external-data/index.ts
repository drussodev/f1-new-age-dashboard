
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

    console.log('Starting data import from external database')

    // Connect to the MySQL database
    const mysqlClient = await new Client().connect({
      hostname: "185.113.141.167",
      username: "russo",
      password: "drusso22", 
      db: "f1tournament",
    })

    // This is now just a direct connection to your MySQL server
    // We fetch data but no longer need to import it to Supabase
    console.log('Fetching data from MySQL database')
    
    const drivers = await mysqlClient.query(`SELECT * FROM drivers`)
    const teams = await mysqlClient.query(`SELECT * FROM teams`)
    const races = await mysqlClient.query(`SELECT * FROM races`)
    const news = await mysqlClient.query(`SELECT * FROM news`)
    const configData = await mysqlClient.query(`SELECT * FROM config`)
    const streamers = await mysqlClient.query(`SELECT * FROM streamers`)

    // Close the MySQL connection
    await mysqlClient.close()

    console.log('MySQL data retrieval successful')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'MySQL connection successful',
        counts: {
          drivers: drivers.length,
          teams: teams.length,
          races: races.length,
          news: news.length,
          config: configData.length,
          streamers: streamers.length
        }
      }),
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
