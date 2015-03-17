package com.chat.session;

import com.chat.datebase.ConnectDatabase;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

@WebServlet(urlPatterns = "/ChatListener")
public class ChatListener extends HttpServlet {
    private JSONParser jsonParser = null;
    private static ConnectDatabase con = null;
    @Override
    public void init() throws ServletException {
        if(con == null){
            con = new ConnectDatabase();
        }
        jsonParser = new JSONParser();
        super.init();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Cookie[] massCook = req.getCookies();
        int id =-1;
        for(Cookie c: massCook){
            if(c.getName().equals("user")){
                id = Integer.parseInt(c.getValue());
            }
        }
        if(id == -1)
            return;
        PrintWriter out = resp.getWriter();
        JSONArray array = con.respClient(id);
        if(array==null)
            return;
        out.print(array);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Cookie[] massCook = req.getCookies();
        int id =-1;
        for(Cookie c: massCook){
            if(c.getName().equals("user")){
                id = Integer.parseInt(c.getValue());
            }
        }
        if(id == -1)
            return;
        String str = req.getParameter("flag");
        if(str!=null && str.equals("1")) {
            PrintWriter out = resp.getWriter();
            out.print(con.respUsers(id));
            return;
        }
        if(str!=null && str.equals("2")) {
            PrintWriter out = resp.getWriter();
            out.print(con.respStart(id));
            return;
        }
        StringBuffer js = new StringBuffer();
        String line;
        try {
            BufferedReader reader = req.getReader();
            while ((line = reader.readLine()) != null)
                js.append(line);
        } catch (Exception e) {}

        JSONObject jObject = new JSONObject();
        try{
            jObject =(JSONObject) jsonParser.parse(js.toString());
        }catch (ParseException e){}
        con.addMail(id,jObject,resp.getWriter());
    }
}
